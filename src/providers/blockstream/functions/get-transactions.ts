import { createClassMethod } from '@/core';
import {
  GetTransactionsOptions,
  GetTransactionsResponse,
  IBlockExplorer,
  TransactionBasicInfo,
} from '@/types';
import * as _ from 'lodash';

type Response = {
  readonly txid: string;
  readonly fee: number;
  readonly status: {
    readonly confirmed: boolean;
    readonly block_height: number;
    readonly block_time: number;
  };
};
const getPath = (walletAddress: string, prevCursor?: Record<string, string>) => {
  const basePath = `/api/address/${walletAddress}/txs`;
  if (prevCursor) {
    const last_seen_txid = prevCursor['last_seen_txid'];
    return `${basePath}/chain/${last_seen_txid}`;
  }
  return basePath;
};
export const getTransactions = createClassMethod<
  IBlockExplorer,
  GetTransactionsOptions,
  Promise<GetTransactionsResponse>
>(async (instance, options) => {
  const { walletAddress, prevCursor, currentBlock } = options;
  const response = await instance
    .client
    .get<Array<Response>>(getPath(walletAddress, prevCursor as Record<string, string>))
    .then(({ data }) => data)
    .catch<Array<Response>>(() => []);
  const items = response.map((item) => ({
    transactionHash: item.txid,
    confirmations: currentBlock ? currentBlock - item.status.block_height : null,
    gasFee: BigInt(item.fee),
    timestamp: item.status.block_time,
  } satisfies TransactionBasicInfo));
  const lastSeen = _.last(items);
  const nextCursor = lastSeen
    ? {
        last_seen_txid: _.last(items),
      }
    : null;
  return { items, nextCursor };
});

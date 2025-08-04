import { createClassMethod } from '@/core';
import {
  GetTransactionsOptions,
  GetTransactionsResponse,
  IBlockExplorer,
  TransactionBasicInfo,
} from '@/types';
import moment from 'moment';

type BaseTransaction = {
  readonly confirmations: number;
  readonly timestamp: string;
  readonly gas_limit: `${number}`;
  readonly gas_used: `${number}`;
  readonly gas_price: `${number}`;
  readonly block_number: number;
};
export const getTransactions = createClassMethod<
  IBlockExplorer,
  GetTransactionsOptions,
  Promise<GetTransactionsResponse>
>(async (instance, options) => {
  const { walletAddress, tokenAddress, prevCursor, take = 20, currentBlock } = options;
  if (tokenAddress) {
    const response = await instance
      .client
      .get<{
        readonly items: Array<{
          readonly transaction_hash: string;
        } & BaseTransaction>;
        readonly next_page_params: object;
      }>(`api/v2/addresses/${walletAddress}/token-transfers`, {
        params: Object.assign(prevCursor ?? {}, {
          filter: 'to|from',
          type: 'ERC-20',
          token: tokenAddress,
          items_count: take ?? 20,
        }),
      })
      .catch<{
        readonly data: null;
      }>(() => ({ data: null }));
    if (!response.data) return { items: [] satisfies TransactionBasicInfo[], nextCursor: null };
    return {
      items: response.data.items.map((item) => ({
        transactionHash: item.transaction_hash,
        confirmations: currentBlock ? currentBlock - item.block_number : null,
        gasFee: null,
        timestamp: moment(item.timestamp).unix(),
      } satisfies TransactionBasicInfo)),
      nextCursor: response.data.next_page_params,
    };
  }

  const response = await instance
    .client
    .get<{
      readonly items: Array<{
        readonly hash: string;
      } & BaseTransaction>;
      readonly next_page_params: object;
    }>(`api/v2/addresses/${walletAddress}/transactions`, {
      params: Object.assign(prevCursor ?? {}, {
        filter: 'to|from',
        items_count: take ?? 20,
      }),
    })
    .catch(() => ({ data: null }));

  if (!response.data) return { items: [] satisfies TransactionBasicInfo[], nextCursor: null };
  return {
    items: response.data.items.map((item) => {
      const gasFee = BigInt(item.gas_used ?? item.gas_limit ?? "0") * BigInt(item.gas_price ?? "0");
      return {
        transactionHash: item.hash,
        confirmations: item.confirmations,
        timestamp: moment(item.timestamp).unix(),
        gasFee,
      } satisfies TransactionBasicInfo;
    }),
    nextCursor: response.data.next_page_params,
  };
});

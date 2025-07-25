import {
  GetTransactionsOptions,
  GetTransactionsResponse,
  IBlockExplorer,
} from '@/types';
import { EtherscanResponse } from '../types';
import { createClassMethod } from '@/core';

type TransactionResponse = {
  readonly hash: string;
};
type Cursor = {
  readonly page: number;
  readonly offset: number;
};
function getRequestParams(
  instance: IBlockExplorer,
  walletAddress: string,
  tokenAddress?: string,
  prevCursor?: Cursor,
) {
  const baseParams = Object.assign(prevCursor ?? {}, {
    chainid: instance.chainId.toString(10),
    module: 'account',
    address: walletAddress,
    startblock: 0,
    endblock: 'latest',
    sort: 'desc',
    apikey: instance.apiKey,
  });
  if (tokenAddress)
    return Object.assign(baseParams, {
      action: 'tokentx',
      contractaddress: tokenAddress,
    });
  return Object.assign(baseParams, {
    action: 'txlist',
  });
}
export const getTransactions = createClassMethod<
  IBlockExplorer,
  GetTransactionsOptions<Cursor>,
  Promise<GetTransactionsResponse>
>(async (instance, options) => {
  const {
    walletAddress,
    tokenAddress,
    prevCursor = {
      page: 1,
      offset: 20,
    },
  } = options;
  const response = await instance
    .client
    .get<EtherscanResponse<Array<TransactionResponse>>>(`/v2/api`, {
      params: getRequestParams(
        instance,
        walletAddress,
        tokenAddress,
        prevCursor,
      ),
    })
    .then(({ data }) => data)
    .catch<EtherscanResponse<[]>>((e) => {
      console.error(e);
      return {
        status: '0',
        message: 'NOTOK',
        result: [],
      };
    });
  const items = response.result.map((item) => item.hash);
  const nextCursor =
    items.length > 0
      ? ({
          page: (prevCursor?.page ?? 1) + 1,
          offset: prevCursor?.offset ?? 0,
        } satisfies Cursor)
      : null;
  return { items, nextCursor };
});

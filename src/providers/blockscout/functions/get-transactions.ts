import { createClassMethod } from '@/core';
import {
  GetTransactionsOptions,
  GetTransactionsResponse,
  IBlockExplorer,
} from '@/types';

export const getTransactions = createClassMethod<
  IBlockExplorer,
  GetTransactionsOptions,
  Promise<GetTransactionsResponse>
>(async (instance, options) => {
  const { walletAddress, tokenAddress, prevCursor, take = 20 } = options;
  if (tokenAddress) {
    const response = await instance
      .client
      .get<{
        readonly items: Array<{
          readonly transaction_hash: string;
        }>;
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
      }>((e) => {
        console.error(e);
        return { data: null };
      });
    if (!response.data) return { items: [], nextCursor: null };
    return {
      items: response.data.items.map((item) => item.transaction_hash),
      nextCursor: response.data.next_page_params,
    };
  }

  const response = await instance
    .client
    .get<{
      readonly items: Array<{
        readonly hash: string;
      }>;
      readonly next_page_params: object;
    }>(`api/v2/addresses/${walletAddress}/transactions`, {
      params: Object.assign(prevCursor ?? {}, {
        filter: 'to|from',
        items_count: take ?? 20,
      }),
    })
    .catch((e) => {
      console.error(e);
      return { data: null };
    });

  if (!response.data) return { items: [], nextCursor: null };
  return {
    items: response.data.items.map((item) => item.hash),
    nextCursor: response.data.next_page_params,
  };
});

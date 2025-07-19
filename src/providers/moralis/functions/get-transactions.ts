import { createClassMethod } from '@/core';
import {
  GetTransactionsOptions,
  GetTransactionsResponse,
  IBlockExplorer,
} from '@/types';

export const getTransactions = createClassMethod<
  IBlockExplorer,
  GetTransactionsOptions
>(async (instance, options): Promise<GetTransactionsResponse> => {
  const { walletAddress, tokenAddress, prevCursor, take = 20 } = options;
  if (tokenAddress) {
    const response = await instance
      .client
      .get<{
        readonly result: Array<{
          readonly transaction_hash: string;
        }>;
        readonly cursor: string;
        readonly page: string;
        readonly page_size: string;
      }>(`api/v2.2/${walletAddress}/erc20/transfers`, {
        params: Object.assign(prevCursor ?? {}, {
          chain: `0x${instance.chainId.toString(16)}`,
          'contract_addresses[0]': tokenAddress,
          order: 'DESC',
          limit: take ?? 20,
        }),
        headers: {
          'X-API-Key': instance.apiKey,
        },
      })
      .catch<{
        readonly data: null;
      }>((e) => {
        console.error(e);
        return { data: null };
      });
    if (!response.data) return { items: [], nextCursor: null };
    return {
      items: response.data.result.map((item) => item.transaction_hash),
      nextCursor: {
        cursor: response.data.cursor,
        limit: response.data.page_size,
      },
    };
  }

  const response = await instance
    .client
    .get<{
      readonly result: Array<{
        readonly hash: string;
      }>;
      readonly cursor: string;
      readonly limit: string;
    }>(`api/v2.2/wallets/${walletAddress}/history`, {
      params: Object.assign(prevCursor ?? {}, {
        chain: `0x${instance.chainId.toString(16)}`,
        order: 'DESC',
        include_internal_transactions: 'false',
        limit: take ?? 20,
      }),
      headers: {
        'X-API-Key': instance.apiKey,
      },
    })
    .catch((e) => {
      console.error(e);
      return { data: null };
    });

  if (!response.data) return { items: [], nextCursor: null };
  return {
    items: response.data.result.map((item) => item.hash),
    nextCursor: {
      cursor: response.data.cursor,
      limit: response.data.limit,
    },
  };
});

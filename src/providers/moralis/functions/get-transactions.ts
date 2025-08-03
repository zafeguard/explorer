import { createClassMethod } from '@/core';
import {
  GetTransactionsOptions,
  GetTransactionsResponse,
  IBlockExplorer,
  TransactionBasicInfo,
} from '@/types';
import moment from 'moment';

export const getTransactions = createClassMethod<
  IBlockExplorer,
  GetTransactionsOptions
>(async (instance, options): Promise<GetTransactionsResponse> => {
  const { walletAddress, tokenAddress, prevCursor, take = 20, currentBlock } = options;
  if (tokenAddress) {
    const response = await instance
      .client
      .get<{
        readonly result: Array<{
          readonly transaction_hash: string;
          readonly block_number: number;
          readonly block_timestamp: string;
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
      items: response.data.result.map((item) => ({
        transactionHash: item.transaction_hash,
        confirmations: currentBlock ? currentBlock - item.block_number : null,
        timestamp: moment(item.block_timestamp).unix(),
        gasFee: null,
      } satisfies TransactionBasicInfo)),
      nextCursor: response.data.cursor && response.data.cursor.length > 0 ? {
        cursor: response.data.cursor,
        limit: response.data.page_size,
      } : null,
    };
  }

  const response = await instance
    .client
    .get<{
      readonly result: Array<{
        readonly hash: string;
        readonly gas_price: `${number}`;
        readonly gas: `${number}`;
        readonly receipt_gas_used: `${number}`;
        readonly block_timestamp: string;
        readonly block_number: `${number}`;
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
    items: response.data.result.map((item) => {
      const gasFee = BigInt(item.receipt_gas_used ?? item.gas ?? "0") * BigInt(item.gas_price ?? "0");
      return {
        transactionHash: item.hash,
        timestamp: moment(item.block_timestamp).unix(),
        gasFee,
        confirmations: currentBlock ? currentBlock - Number(item.block_number) : null,
      } satisfies TransactionBasicInfo
    }),
    nextCursor: response.data.cursor && response.data.cursor.length > 0 ? {
      cursor: response.data.cursor,
      limit: response.data.limit,
    } : null,
  };
});

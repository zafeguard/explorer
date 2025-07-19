import { createClassMethod } from '@/core';
import {
  GetHoldingTokenOptions,
  GetHoldingTokenResponse,
  IBlockExplorer,
} from '@/types';

export const getHoldingTokens = createClassMethod<
  IBlockExplorer,
  GetHoldingTokenOptions,
  Promise<GetHoldingTokenResponse>
>(async (instance, options) => {
  const { walletAddress, prevCursor } = options;
  const response = await instance
    .client
    .get<{
      readonly items: Array<{
        readonly token: {
          readonly address_hash: string;
          readonly decimals: string;
          readonly name: string;
          readonly holders: string;
          readonly symbol: string;
          readonly type: string;
        };
        readonly value: string;
      }>;
      readonly next_page_params: {
        readonly block_number: number;
        readonly index: number;
        readonly items_count: number;
      };
    }>(`api/v2/addresses/${walletAddress}/tokens?type=ERC-20`, {
      params: prevCursor ?? {},
    })
    .catch<{
      readonly data: null;
    }>((e) => {
      console.error(e);
      return { data: null };
    });

  const items = (response.data?.items ?? []).map((item) =>
    item.token.address_hash.toLowerCase(),
  );
  const nextCursor = response.data?.next_page_params as object;

  return { items, nextCursor };
});

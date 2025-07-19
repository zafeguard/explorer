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
  const { walletAddress } = options;
  const response = await instance
    .client
    .get<
      Array<{
        readonly token_address: string;
      }>
    >(`api/v2.2/${walletAddress}/erc20`, {
      params: {
        chain: `0x${instance.chainId.toString(16)}`,
        exclude_spam: true,
      },
      headers: {
        'X-API-Key': instance.apiKey,
      },
    })
    .catch<{
      readonly data: [];
    }>((e) => {
      console.error(e);
      return { data: [] };
    });

  const items = (response.data ?? []).map((item) =>
    item.token_address.toLowerCase(),
  );
  const nextCursor = null;

  return { items, nextCursor };
});

import { createClassMethod } from '@/core';
import {
  GetTokenInfoOptions,
  GetTokenInfoResponse,
  IBlockExplorer,
} from '@/types';
import * as _ from 'lodash';

export const getTokenInfo = createClassMethod<
  IBlockExplorer,
  GetTokenInfoOptions
>(async (instance, options): Promise<GetTokenInfoResponse> => {
  const { tokenAddress } = options;
  if (!tokenAddress) throw new Error('Invalid token address');
  const response = await instance
    .client
    .get<
      Array<{
        readonly name: string;
        readonly symbol: string;
        readonly decimals: string;
        readonly logo: string;
        readonly total_supply: string;
        readonly market_cap: string;
      }>
    >(`api/v2.2/erc20/metadata`, {
      params: {
        chain: `0x${instance.chainId.toString(16)}`,
        'addresses[0]': tokenAddress,
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
  if (!response.data || response.data.length <= 0)
    throw new Error('Invalid token address');

  const token = response.data[0];
  return {
    symbol: token.symbol,
    name: token.name,
    decimals: parseInt(token.decimals),
    logoURI: token.logo,
  };
});

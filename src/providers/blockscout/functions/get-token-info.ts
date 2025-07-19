import { createClassMethod } from '@/core';
import {
  GetTokenInfoOptions,
  GetTokenInfoResponse,
  IBlockExplorer,
} from '@/types';
import * as _ from 'lodash';

export const getTokenInfo = createClassMethod<
  IBlockExplorer,
  GetTokenInfoOptions,
  Promise<GetTokenInfoResponse>
>(async (instance, options) => {
  const { tokenAddress } = options;
  if (!tokenAddress) throw new Error('Invalid token address');
  const response = await instance
    .client
    .get<{
      readonly address_hash: string;
      readonly decimals: string;
      readonly holders: string;
      readonly icon_url?: string;
      readonly name: string;
      readonly symbol: string;
      readonly total_supply: string;
      readonly circulating_market_cap: string;
    }>(`api/v2/tokens/${tokenAddress}`, {
      params: {},
    })
    .catch<{
      readonly data: null;
    }>((e) => {
      console.error(e);
      return { data: null };
    });

  if (!response.data) throw new Error(`Invalid token "${tokenAddress}"`);
  return {
    symbol: response.data.symbol,
    name: response.data.name,
    decimals: parseInt(response.data.decimals),
    logoURI: response.data.icon_url,
  };
});

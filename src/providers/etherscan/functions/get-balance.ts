import { GetBalanceOptions, IBlockExplorer } from '@/types';
import { EtherscanResponse } from '../types';
import { createClassMethod } from '@/core';

type AccountBalanceResponse = EtherscanResponse<`${number}`>;

function getRequestParams(
  instance: IBlockExplorer,
  walletAddress: string,
  tokenAddress?: string,
) {
  const baseParams = {
    chainid: instance.chainId.toString(10),
    module: 'account',
    address: walletAddress,
    tag: 'latest',
    apikey: instance.apiKey,
  };
  if (tokenAddress)
    return Object.assign(baseParams, {
      action: 'tokenbalance',
      contractaddress: tokenAddress,
    });
  return Object.assign(baseParams, {
    action: 'balance',
  });
}

export const getBalance = createClassMethod<IBlockExplorer, GetBalanceOptions, Promise<bigint>>(
  async (instance, options) => {
    const { walletAddress, tokenAddress } = options;
    const response = await instance
      .client
      .get<AccountBalanceResponse>(`/v2/api`, {
        params: getRequestParams(instance, walletAddress, tokenAddress),
      })
      .catch<null>(() => null);
    if (!response) return BigInt(0);
    return BigInt(response.data.result);
  },
);

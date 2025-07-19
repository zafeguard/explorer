import { createClassMethod } from '@/core';
import { GetBalanceOptions, IBlockExplorer } from '@/types';

export const getBalance = createClassMethod<IBlockExplorer, GetBalanceOptions, Promise<bigint>>(
  async (instance, options) => {
    const { walletAddress, tokenAddress } = options;
    if (tokenAddress) throw new Error('Unsupported token address');
    const response = await instance
      .client
      .get<{
        readonly chain_stats: {
          readonly funded_txo_sum: number;
          readonly spent_txo_sum: number;
        };
      }>(`/api/address/${walletAddress}`)
      .catch<null>(() => null);
    if (!response) return BigInt(0);
    const chainStats = response.data.chain_stats;
    const confirmedBalance =
      chainStats.funded_txo_sum - chainStats.spent_txo_sum;
    return BigInt(confirmedBalance);
  },
);

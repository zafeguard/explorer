import { createClassMethod } from '@/core';
import { BroadcastOptions, IBlockExplorer } from '@/types';

export const broadcast = createClassMethod<IBlockExplorer, BroadcastOptions, Promise<string>>(
  async (instance, options) => {
    const { signedTransaction } = options;
    const response = await instance
      .client
      .post<string>(`/api/tx`, signedTransaction.toString('hex'))
      .catch<null>(() => null);
    if (!response) throw new Error('Unable to broadcast transaction');
    return response.data;
  },
);

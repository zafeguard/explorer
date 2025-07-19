import { createClassMethod } from '@/core';
import { GetUTXOsOptions, GetUTXOsResponse, IBlockExplorer } from '@/types';

type UTXO = {
  readonly txid: string;
  readonly vout: number;
  readonly value: number;
  readonly status: {
    readonly confirmed: boolean;
    readonly block_height: number;
    readonly block_hash: string;
    readonly block_time: number;
  };
};
export const getUTXOs = createClassMethod<IBlockExplorer, GetUTXOsOptions, Promise<Array<GetUTXOsResponse>>>(
  async (instance, options) => {
    const { walletAddress } = options;
    const response: Array<UTXO> = await instance
      .client
      .get<Array<UTXO>>(`/api/address/${walletAddress}/utxo`)
      .then(({ data }) => data)
      .catch(() => []);

    const utxos: Array<GetUTXOsResponse> = [];
    for (const transaction of response) {
      if (!transaction) continue;
      const txHex = await instance
        .client
        .get<string>(`/api/tx/${transaction.txid}/hex`)
        .then(({ data }) => data)
        .catch<null>(() => null);
      if (!txHex || txHex.length < 10) continue;
      utxos.push({
        hash: transaction.txid,
        transaction: txHex,
        vout: transaction.vout,
        confirmed: transaction.status.confirmed,
        value: transaction.value,
      });
    }
    return utxos;
  },
);

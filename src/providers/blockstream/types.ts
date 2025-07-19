export type TransactionInfo = {
  readonly txid: string;
  readonly version: number;
  readonly locktime: number;
  readonly vin: Vin[];
  readonly vout: Vout[];
  readonly size: number;
  readonly weight: number;
  readonly fee: number;
  readonly status: TransactionStatus;
};

export type Vin = {
  readonly txid: string;
  readonly vout: number;
  readonly prevout: PrevOut;
  readonly scriptsig: string;
  readonly scriptsig_asm: string;
  readonly witness: string[];
  readonly is_coinbase: boolean;
  readonly sequence: number;
};

export type PrevOut = {
  readonly scriptpubkey: string;
  readonly scriptpubkey_asm: string;
  readonly scriptpubkey_type: string;
  readonly scriptpubkey_address: string;
  readonly value: number;
};

export type Vout = {
  readonly scriptpubkey: string;
  readonly scriptpubkey_asm: string;
  readonly scriptpubkey_type: string;
  readonly scriptpubkey_address: string;
  readonly value: number;
};

export type TransactionStatus = {
  readonly confirmed: boolean;
  readonly block_height: number;
  readonly block_hash: string;
  readonly block_time: number;
};

import { AxiosInstance } from 'axios';
import * as _ from 'lodash';

export interface IBlockExplorer {
  readonly apiUrl: string;
  readonly apiKeys: () => string[];
  readonly chainId: bigint;
  readonly apiKey?: string;
  readonly client: AxiosInstance;
  readonly requiredApiKey: boolean;

  getTransactions?(
    options: GetTransactionsOptions,
  ): Promise<GetTransactionsResponse>;
  getTokenInfo?(options: GetTokenInfoOptions): Promise<GetTokenInfoResponse>;
  getHoldingTokens?(
    options: GetHoldingTokenOptions,
  ): Promise<GetHoldingTokenResponse>;
  getBalance?(options: GetBalanceOptions): Promise<bigint>;
  getUTXOs?(options: GetUTXOsOptions): Promise<Array<GetUTXOsResponse>>;
  broadcast?(options: BroadcastOptions): Promise<string>;
}

type TokenAddress = string;
type WalletAddress = string;
export type GetTransactionsOptions<T = object> = {
  readonly walletAddress: WalletAddress;
  readonly tokenAddress?: TokenAddress;
  readonly currentBlock?: number;
  /**
   * Pagination
   **/
  readonly take?: number;
  readonly prevCursor?: T;
};
export type TransactionBasicInfo = {
  readonly transactionHash: string;
  readonly confirmations: number | null;
  readonly gasFee: bigint | null;
  readonly timestamp: number;
};
export type GetTransactionsResponse = {
  readonly items: Array<TransactionBasicInfo>;
  /**
   * Pagination
   **/
  readonly nextCursor: object | null;
};
export type GetTokenInfoOptions = {
  readonly tokenAddress: TokenAddress;
};
export type GetHoldingTokenOptions = {
  readonly walletAddress: WalletAddress;
  /**
   * Pagination
   **/
  readonly prevCursor?: object;
};
export type GetHoldingTokenResponse = {
  readonly items: Array<TokenAddress>;
  /**
   * Pagination
   **/
  readonly nextCursor: object | null;
};
export type GetTokenInfoResponse = {
  readonly symbol: string;
  readonly name: string;
  readonly decimals: number;
  readonly logoURI?: string;
};
export type GetBalanceOptions = {
  readonly walletAddress: string;
  readonly tokenAddress?: string;
};
export type GetUTXOsOptions = {
  readonly walletAddress: string;
};
export type GetUTXOsResponse = {
  /**
   * Raw transaction (Hex string)
   **/
  readonly transaction: string;
  /**
   * Output number
   **/
  readonly vout: number;
  /**
   * Transaction Hash
   **/
  readonly hash: string;
  /**
   * Value
   **/
  readonly value: number;
  readonly confirmed: boolean;
};
export type BroadcastOptions = {
  readonly signedTransaction: Buffer;
};

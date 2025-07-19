export type EtherscanResponse<T> = {
  readonly status: `${number}`;
  readonly message: string;
  readonly result: T;
};

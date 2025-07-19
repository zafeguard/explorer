import { AxiosInstance } from "axios";
import { IBlockExplorer } from "./provider";
import { Class } from "type-fest";

export type ExplorerOptions = {
    readonly apiUrl: string;
    readonly apiKeys?: () => string[];
    readonly chainId: bigint;
    readonly client?: AxiosInstance;
};
export type BootstrapOptions = {
    readonly explorer: Class<IBlockExplorer, [ExplorerOptions]>;
    readonly options: Omit<ExplorerOptions, "chainId">;
}
export type FunctionKeys<T> = Extract<{
  [K in keyof T]: NonNullable<T[K]> extends (...args: any[]) => any ? K : never;
}[keyof T], keyof T>;
export type FunctionType<T, K extends keyof T> = Extract<T[K], (...args: any[]) => any>;
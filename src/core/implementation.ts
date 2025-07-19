import axios, { AxiosError, AxiosInstance } from "axios";
import * as _ from "lodash";
import { ExplorerOptions } from "../types/core";

export abstract class AbstractBlockExplorer {
    public readonly apiUrl: string;
    public readonly apiKeys: () => string[];
    public readonly chainId: bigint;
    private readonly axios?: AxiosInstance;
    public abstract readonly requiredApiKey: boolean;

    constructor(options: ExplorerOptions) {
        const {
            apiUrl,
            apiKeys = () => [],
            chainId,
            client
        } = options;

        this.apiUrl = apiUrl;
        this.apiKeys = apiKeys;
        this.chainId = chainId;
        if (client) this.axios = client;
    }

    get client (): AxiosInstance {
        if (this.axios) return this.axios;
        const client = axios.create({
            baseURL: this.apiUrl,
        });
        /** Add `console.log` to Axios instance when throwing an error **/
        client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                return Promise.reject(error);
            },
        );
        return client;
    }

    get apiKey() {
        return _.sample(this.apiKeys()) ?? undefined;
    }
}

export const createClassMethod = <T, O, R = any>(
    fn: (instance: T, options: O) => R,
) => {
    return (instance: T) => (options: O) => fn(instance, options);
};

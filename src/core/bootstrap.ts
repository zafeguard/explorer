import { BootstrapOptions, FunctionKeys, IBlockExplorer } from "@/types";
import { AxiosInstance } from "axios";
import * as _ from "lodash";

export class Caller implements IBlockExplorer {
    constructor(
        private readonly instances: Array<IBlockExplorer>,
    ) { }

    private _call<T extends keyof IBlockExplorer = keyof IBlockExplorer>(methodName: T): IBlockExplorer[T] | undefined {
        const instances = this.instances.filter(i => typeof i[methodName] !== "undefined");
        const instance = _.sample(instances);
        if (!instance)
            return;
        if (instance.requiredApiKey === true && !instance.apiKey)
            return;
        return instance[methodName];
    }
    protected callProperty<T extends keyof IBlockExplorer>(methodName: T): IBlockExplorer[T] | undefined {
        const method = this._call(methodName);
        if (!method || typeof method === "undefined") return undefined;
        return method;
    }
    protected callFunction<
        T extends FunctionKeys<IBlockExplorer>,
        R extends NonNullable<IBlockExplorer[T]>
    >(
        methodName: T
    ): R {
        const method = this._call(methodName);
        if (!method || typeof method === "undefined") return ((...args: any[]) => null) as unknown as R;
        return method as unknown as R;
    }

    readonly requiredApiKey: boolean = this.callProperty("requiredApiKey")!;
    readonly apiUrl: string = this.callProperty("apiUrl")!;
    readonly apiKeys: () => string[] = this.callProperty("apiKeys")!;
    readonly chainId: bigint = this.callProperty("chainId")!;
    readonly apiKey?: string = this.callProperty("apiKey");
    readonly client: AxiosInstance = this.callProperty("client")!;

    getTransactions = this.callFunction("getTransactions");
    getTokenInfo = this.callFunction("getTokenInfo");
    getHoldingTokens = this.callFunction("getHoldingTokens");
    getBalance = this.callFunction("getBalance");
    getUTXOs = this.callFunction("getUTXOs");
    broadcast = this.callFunction("broadcast");
}
export class Explorer<T extends string = string> {
    private readonly explorers: Record<string, Array<IBlockExplorer>> = {};
    private constructor() { }

    static create<T extends string = string>() {
        return new Explorer<T>();
    }

    register(blockchain: T, chainId: bigint, params: Array<BootstrapOptions>) {
        if (typeof this.explorers?.[blockchain] === "undefined")
            this.explorers[blockchain] = [];

        for (const { explorer: Explorer, options } of params) {
            this.explorers[blockchain].push(
                new Explorer(Object.assign(_.cloneDeep(options), {
                    chainId,
                }))
            );
        }
    }

    use(blockchain: T) {
        const explorer = this.explorers?.[blockchain];
        if (!explorer) return null;
        return new Caller(explorer);
    }
}

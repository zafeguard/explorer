import { BLOCKSCOUT_API_URL, BlockscoutModule, ETHERSCAN_API_URL, EtherscanModule, Explorer } from "../src/index"

enum EBlockchain {
    ETH_MAINNET = "eth_mainnet",
    ETH_SEPOLIA = "eth_sepolia",
    BSC_MAINNET = "bsc_mainnet",
    BSC_TESTNET = "bsc_testnet",
};
const explorer = Explorer.create<EBlockchain>();
explorer.register(EBlockchain.ETH_MAINNET, BigInt(1), [
    {
        explorer: EtherscanModule,
        options: {
            apiUrl: ETHERSCAN_API_URL.eth,
        }
    },
    {
        explorer: BlockscoutModule,
        options: {
            apiUrl: BLOCKSCOUT_API_URL.eth,
        },
    }
]);
explorer.register(EBlockchain.ETH_SEPOLIA, BigInt(11155111), [
    {
        explorer: EtherscanModule,
        options: {
            apiUrl: ETHERSCAN_API_URL.eth_sepolia,
        }
    },
    {
        explorer: BlockscoutModule,
        options: {
            apiUrl: BLOCKSCOUT_API_URL.eth_sepolia,
        }
    }
]);
explorer.register(EBlockchain.BSC_MAINNET, BigInt(56), [
    {
        explorer: EtherscanModule,
        options: {
            apiUrl: ETHERSCAN_API_URL.bsc,
        }
    },
]);
explorer.register(EBlockchain.BSC_TESTNET, BigInt(97), [
    {
        explorer: EtherscanModule,
        options: {
            apiUrl: ETHERSCAN_API_URL.bsc_testnet,
        }
    }
]);

async function main() {
    const caller = explorer.use(EBlockchain.ETH_MAINNET);
    if (!caller) return null;

    const balance = await caller.getBalance({
        walletAddress: "0x0000000000000000000000000000000000000000"
    });
    console.log(balance);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
})
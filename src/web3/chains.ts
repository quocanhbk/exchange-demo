import { Chain } from "./types"

const chains: Chain[] = [
    {
        id: 1,
        type: "main",
        name: "Ethereum Mainnet",
        testnet: false,
    },
    {
        id: 3,
        type: "ropsten",
        name: "Ropsten Testnet",
        testnet: true,
    },
    {
        id: 4,
        type: "rinkeby",
        name: "Rinkeby Testnet",
        testnet: true,
    },
    {
        id: 5,
        type: "goerli",
        name: "Goerli Testnet",
        testnet: true,
    },
    {
        id: 42,
        type: "kovan",
        name: "Kovan Testnet",
        testnet: true,
    },
    {
        id: 1337,
        type: "local",
        name: "Localhost",
        testnet: true,
    },
]

export function isKnownChain(chainId: number): boolean {
    return !!chains.find(chain => chain.id === chainId)
}

export function getChain(chainId: number): Chain | null {
    const chain = chains.find(chain => chain.id === chainId)
    return chain || null
}

export function getDefaultChainId(): number {
    return 1
}

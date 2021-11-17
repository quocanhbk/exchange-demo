import { AbstractConnector } from "@web3-react/abstract-connector"

export type Status = "connected" | "disconnected" | "connecting" | "error"

type EthereumProviderEip1193 = {
    request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>
}

type EthereumProviderSend = {
    send: (method: string, params: string[]) => Promise<unknown>
}

type EthereumProviderSendAsync = {
    sendAsync: (
        params: {
            method: string
            params: string[]
            from: string
            jsonrpc: "2.0"
            id: number
        },
        callback: (err: Error, result: unknown) => void
    ) => void
    selectedAddress: string
}

export type EthereumProvider = EthereumProviderEip1193 & EthereumProviderSend & EthereumProviderSendAsync

export type Connector = {
    web3ReactConnector: AbstractConnector
    handleActivationError?: (error: Error) => Error | null
}

export type Chain = {
    id: number
    type: string
    testnet: boolean
    name: string
}

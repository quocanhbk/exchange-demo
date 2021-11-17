export class ChainUnsupportedError extends Error {
    constructor(message: string, ...params: any[]) {
        super(...params)
        this.name = "ChainUnsupportedError"
        this.message = message
    }
}

export class ConnectionRejectedError extends Error {
    constructor(...params: any[]) {
        super(...params)
        this.name = "ConnectionRejectedError"
        this.message = `The activation has been rejected by the provider.`
    }
}

export class NoMetaMaskError extends Error {
    constructor(...params: any[]) {
        super(...params)
        this.name = "NoMetaMaskError"
        this.message = "MetaMask not found."
    }
}

export class ConnectorConfigError extends Error {
    constructor(...params: any[]) {
        super(...params)
        this.name = "ConnectorConfigError"
    }
}

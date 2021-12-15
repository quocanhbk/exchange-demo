import initGnosis from "./gnosis"
import initInjected from "./injected"
import initTrezor from "./trezor"
import initWalletConnect from "./walletConnect"

export const connectors = {
    injected: initInjected,
    walletConnect: initWalletConnect,
    gnosis: initGnosis,
} as const

export type ConnectorId = keyof typeof connectors

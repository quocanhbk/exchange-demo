import initInjected from "./injected"

export const connectors = {
    injected: initInjected,
} as const

export type ConnectorId = keyof typeof connectors

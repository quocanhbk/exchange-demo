import { SafeAppConnector } from "@gnosis.pm/safe-apps-web3-react"
import { Connector } from "../types"

// Injected is actually MetaMask Extension
const initGnosis = (): Connector => {
    return {
        web3ReactConnector: new SafeAppConnector({ supportedChainIds: [4] }),
    }
}

export default initGnosis

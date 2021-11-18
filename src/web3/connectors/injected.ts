import { InjectedConnector, UserRejectedRequestError, NoEthereumProviderError } from "@web3-react/injected-connector"
import { ConnectionRejectedError, NoMetaMaskError } from "../errors"
import { Connector } from "../types"

// Injected is actually MetaMask Extension
const initInjected = (): Connector => {
    return {
        web3ReactConnector: new InjectedConnector({ supportedChainIds: [4] }),
        handleActivationError: (err: Error) => {
            return err instanceof UserRejectedRequestError
                ? new ConnectionRejectedError()
                : err instanceof NoEthereumProviderError
                ? new NoMetaMaskError()
                : null
        },
    }
}

export default initInjected

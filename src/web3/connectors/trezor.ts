import { TrezorConnector } from "@web3-react/trezor-connector"
import { Connector } from "../types"

// Injected is actually MetaMask Extension
const initTrezor = (): Connector => {
    return {
        web3ReactConnector: new TrezorConnector({
            chainId: 4,
            manifestAppUrl: "https://localhost:1234",
            manifestEmail: "dummy@abc.xyz",
            url: "",
        }),
    }
}

export default initTrezor

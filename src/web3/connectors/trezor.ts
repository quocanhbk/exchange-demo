import { TrezorConnector } from "@web3-react/trezor-connector"
import { Connector } from "../types"

// Injected is actually MetaMask Extension
const initTrezor = (): Connector => {
    return {
        web3ReactConnector: new TrezorConnector({
            manifestEmail: "dummy@abc.xyz",
            manifestAppUrl: "https://localhost:1234",
            chainId: 4,
            url: "",
        }),
    }
}

export default initTrezor

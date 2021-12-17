import { TrezorConnector } from "@web3-react/trezor-connector"
import { Connector } from "../types"

// Injected is actually MetaMask Extension
const initTrezor = (): Connector => {
    return {
        web3ReactConnector: new TrezorConnector({
            chainId: 4,
            manifestAppUrl: "https://test-wallet.vercel.app/",
            manifestEmail: "quocanhbk17@gmail.com",
            url: "https://rinkeby.infura.io/v3/47a3dff66e3e49c2b8fff75f0eb95c90",
        }),
    }
}

export default initTrezor

import { BigNumberish, providers, utils } from "ethers"
import DynamicERC20 from "./DynamicERC20"
import DynamicERC721 from "./DynamicERC721"
import ERC20 from "./ERC20"
import ERC721 from "./ERC721"
import { Exchange } from "./Exchange"

export const weiToEther = (balance: BigNumberish) => {
    const actualValue = parseFloat(utils.formatEther(balance))
    return actualValue
}

export class ContractCaller {
    provider: providers.Web3Provider
    Weth: ERC20
    Inu: ERC721
    Neko: ERC721
    DynamicERC721: DynamicERC721
    DynamicERC20: DynamicERC20
    Exchange: Exchange

    constructor(provider: any) {
        this.provider = new providers.Web3Provider(provider)
        console.log(this.provider.getSigner())
        this.Weth = new ERC20(this.provider, "0xc778417e063141139fce010982780140aa0cd5ab")
        this.Inu = new ERC721(this.provider, "0x4d91fa57abfead5fbc8445e45b906b85bbd9744c")
        this.Neko = new ERC721(this.provider, "0x97c8480d593b93ae90f8613a5b2ac02e7a3dd0ed")
        this.DynamicERC721 = new DynamicERC721(this.provider)
        this.DynamicERC20 = new DynamicERC20(this.provider)
        this.Exchange = new Exchange(this.provider)
    }

    public async getEtherBalance(from: string) {
        const balance = await this.provider.getBalance(from)
        return weiToEther(balance)
    }

    public async sign(message: any) {
        const signer = this.provider.getSigner()
        const signature = await signer.signMessage(message)
        return signature
    }
}

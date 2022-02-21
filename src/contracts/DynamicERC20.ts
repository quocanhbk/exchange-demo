import { BigNumber, ethers, providers } from "ethers"
import { ERC20_ABI } from "../constant"

class DynamicERC20 {
    provider: providers.Web3Provider

    constructor(provider: providers.Web3Provider) {
        this.provider = provider
    }

    public getContract = (contractAddress: string) => {
        return new ethers.Contract(contractAddress, ERC20_ABI, this.provider)
    }

    async getBalance(contractAddress: string, address: string): Promise<BigNumber> {
        return await this.getContract(contractAddress).balanceOf(address)
    }

    async allowance(contractAddress: string, ownerAddress: string, targetAddress: string): Promise<BigNumber> {
        return await this.getContract(contractAddress).allowance(ownerAddress, targetAddress)
    }

    async approve(contractAddress: string, targetAddress: string, value: BigNumber): Promise<void> {
        const signer = this.provider.getSigner()
        await this.getContract(contractAddress).connect(signer).approve(targetAddress, value)
    }
}

export default DynamicERC20

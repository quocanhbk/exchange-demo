import { BigNumber, ethers } from "ethers"
import { weiToEther } from "."
import { ERC721_ABI } from "../constant"

class DynamicERC20 {
    provider: ethers.providers.Provider

    constructor(provider: ethers.providers.Provider) {
        this.provider = provider
    }

    private getContract = (contractAddress: string) => {
        return new ethers.Contract(contractAddress, ERC721_ABI, this.provider)
    }

    async getBalance(contractAddress: string, address: string): Promise<BigNumber> {
        return await this.getContract(contractAddress).balanceOf(address)
    }

    async allowance(contractAddress: string, ownerAddress: string, targetAddress: string): Promise<BigNumber> {
        return await this.getContract(contractAddress).allowance(ownerAddress, targetAddress)
    }

    async approve(contractAddress: string, targetAddress: string, value: BigNumber): Promise<void> {
        await this.getContract(contractAddress).approve(targetAddress, value)
    }
}

export default DynamicERC20

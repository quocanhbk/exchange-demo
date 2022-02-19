import { Contract, ethers } from "ethers"
import { weiToEther } from "."
import { ERC20_ABI } from "../constant"

class ERC20 {
    contract: Contract

    constructor(provider: ethers.providers.Provider, contractAddress: string) {
        this.contract = new ethers.Contract(
            contractAddress,
            ERC20_ABI,
            provider
        )
    }

    async getBalance(address: string): Promise<number> {
        return weiToEther(await this.contract.balanceOf(address))
    }

    async allowance(
        ownerAddress: string,
        targetAddress: string
    ): Promise<number> {
        return await weiToEther(
            this.contract.allowance(ownerAddress, targetAddress)
        )
    }

    async approve(targetAddress: string, value: number): Promise<void> {
        await this.contract.approve(targetAddress, value)
    }
}

export default ERC20

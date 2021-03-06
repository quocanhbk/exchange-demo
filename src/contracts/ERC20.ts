import { BigNumber, Contract, ethers, providers } from "ethers"

import { ERC20_ABI } from "../constant"

class ERC20 {
    provider: providers.Web3Provider
    contract: Contract

    constructor(provider: providers.Web3Provider, contractAddress: string) {
        this.provider = provider
        this.contract = new ethers.Contract(contractAddress, ERC20_ABI, provider)
    }

    async getBalance(address: string): Promise<BigNumber> {
        return await this.contract.balanceOf(address)
    }

    async allowance(ownerAddress: string, targetAddress: string): Promise<BigNumber> {
        return await this.contract.allowance(ownerAddress, targetAddress)
    }

    async approve(targetAddress: string, value: BigNumber): Promise<void> {
        const signer = this.provider.getSigner()
        const tx = this.contract.connect(signer).approve(targetAddress, value)
        await tx.wait()
    }
}

export default ERC20

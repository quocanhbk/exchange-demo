import { Contract, providers } from "ethers"
import { ERC721_ABI } from "../constant"
import { race } from "../helper"

class ERC721 {
    provider: providers.Web3Provider
    contract: Contract

    constructor(provider: providers.Web3Provider, contractAddress: string) {
        this.provider = provider
        this.contract = new Contract(contractAddress, ERC721_ABI, provider)
    }

    async balanceOf(address: string): Promise<number> {
        return await this.contract.balanceOf(address)
    }

    async tokenOfOwnerByIndex(address: string, index: number): Promise<number> {
        return await this.contract.tokenOfOwnerByIndex(address, index)
    }

    async isApprovedForAll(ownerAddress: string, targetAddress: string): Promise<boolean> {
        return await this.contract.isApprovedForAll(ownerAddress, targetAddress)
    }

    async setApprovalForAll(targetAddress: string) {
        const signer = this.provider.getSigner()
        const tx = this.contract.connect(signer).setApprovalForAll(targetAddress, true)
        await tx.wait()
    }
}

export default ERC721

import { ethers } from "ethers"
import { ERC721_ABI } from "../constant"

class DynamicERC721 {
    provider: ethers.providers.Provider

    constructor(provider: ethers.providers.Provider) {
        this.provider = provider
    }

    private getContract = (contractAddress: string) => {
        return new ethers.Contract(contractAddress, ERC721_ABI, this.provider)
    }

    async balanceOf(contractAddress: string, address: string): Promise<number> {
        return await this.getContract(contractAddress).balanceOf(address)
    }

    async tokenOfOwnerByIndex(contractAddress: string, owner: string, index: number): Promise<number> {
        return await this.getContract(contractAddress).tokenOfOwnerByIndex(owner, index)
    }

    async isApprovedForAll(contractAddress: string, owner: string, target: string): Promise<boolean> {
        return await this.getContract(contractAddress).isApprovedForAll(owner, target)
    }

    async setApprovalForAll(contractAddress: string, target: string) {
        await this.getContract(contractAddress).setApprovalForAll(target, true)
    }
}

export default DynamicERC721

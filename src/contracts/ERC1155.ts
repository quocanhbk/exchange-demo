import { Contract, ethers } from "ethers"
import { ERC721_ABI } from "../constant"

class ERC1155 {
    contract: Contract

    constructor(provider: ethers.providers.Provider, contractAddress: string) {
        this.contract = new ethers.Contract(
            contractAddress,
            ERC721_ABI,
            provider
        )
    }

    async tokenOfOwnerByIndex(address: string, index: number): Promise<number> {
        return await this.contract.tokenOfOwnerByIndex(address, index)
    }

    async isApprovedForAll(
        ownerAddress: string,
        targetAddress: string
    ): Promise<boolean> {
        return await this.contract.isApprovedForAll(ownerAddress, targetAddress)
    }

    async setApprovalForAll(targetAddress: string) {
        await this.contract.setApprovalForAll(targetAddress, true)
    }
}

export default ERC1155

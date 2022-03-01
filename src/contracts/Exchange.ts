import { Contract, ethers, providers } from "ethers"

import { EXCHANGEV2_ABI } from "../constant"
import { orderToStruct } from "../helper"
import { Order } from "../types"

export class Exchange {
    Exchange: Contract
    provider: providers.Web3Provider

    constructor(provider: providers.Web3Provider, contractAddress: string) {
        this.Exchange = new ethers.Contract(contractAddress, EXCHANGEV2_ABI, provider)
        this.provider = provider
    }

    public getContract() {
        return this.Exchange
    }

    public async cancelOrder(order: Order) {
        const signer = this.provider.getSigner()
        const tx = await this.Exchange.connect(signer).cancel(orderToStruct(order))
        await tx.wait()
    }

    public async matchOrders(leftOrder: Order, leftSignature: string, rightOrder: Order, rightSignature: string) {
        console.log("MATCH", leftOrder, rightOrder)
        const signer = this.provider.getSigner()
        const tx = await this.Exchange.connect(signer).matchOrders(
            orderToStruct(leftOrder),
            leftSignature,
            orderToStruct(rightOrder),
            rightSignature,
            {
                gasLimit: 1000000,
                value: rightOrder.makeAsset.assetType.assetClass === "ERC20" ? 0 : rightOrder.makeAsset.value,
            }
        )

        await tx.wait()
    }
}

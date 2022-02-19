import { Contract, ethers, providers } from "ethers"
import { EXCHANGEV2_ABI } from "../constant"
import { orderToStruct } from "../helper"
import { Order } from "../types"

export class Exchange {
    Exchange: Contract
    provider: providers.Web3Provider

    constructor(provider: ethers.providers.Web3Provider) {
        this.Exchange = new ethers.Contract("0x21E77f475E8B4eA1500A083905CD642044C4eF7A", EXCHANGEV2_ABI, provider)
        this.provider = provider
    }

    public async cancelOrder(order: Order) {
        const signer = this.provider.getSigner()
        await this.Exchange.connect(signer).cancel(orderToStruct(order))
    }

    public async matchOrders(leftOrder: Order, leftSignature: string, rightOrder: Order, rightSignature) {
        const signer = this.provider.getSigner()
        await this.Exchange.connect(signer).matchOrders(
            orderToStruct(leftOrder),
            leftSignature,
            orderToStruct(rightOrder),
            rightSignature,
            {
                gasLimit: 500000,
                value: rightOrder.makeAsset.assetType.assetClass === "ERC20" ? 0 : rightOrder.makeAsset.value,
            }
        )
    }
}

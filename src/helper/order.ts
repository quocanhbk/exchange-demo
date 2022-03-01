import { ethers } from "ethers"
import { ZERO_ADDRESS } from "../constant"
import { Asset, AssetClass, Order } from "../types"

interface OrderTime {
    start: number
    end: number
}

interface GenOfferAssetsInput extends OrderTime {
    maker: string
    /** ERC-721 or ERC-1155 contract address */
    takeAddress: string
    /** ERC-20 contract address */
    makeAddress: string
    tokenId: number
    price: number | string
    amount?: number
}

export const genOfferOrder = (input: GenOfferAssetsInput): Order => {
    return {
        itemId: `${input.takeAddress}:${input.tokenId}`,
        maker: input.maker,
        taker: ZERO_ADDRESS,
        makeAsset: {
            assetType: {
                assetClass: "ERC20",
                contract: input.makeAddress,
            },
            value: input.price,
        },
        takeAsset: {
            assetType: {
                assetClass: input.amount ? "ERC1155" : "ERC721",
                contract: input.takeAddress,
                tokenId: input.tokenId,
            },
            value: input.amount || 1,
        },
        salt: ethers.utils.id(Math.floor(Math.random() * 1000000).toString()),
        start: input.start,
        end: input.end,
        signature: "0x",
        orderType: "RARIBLE_V2",
        side: "Offer",
        data: {
            dataType: "DATA_V2_TYPE",
            payouts: [],
            originFees: [],
            isMakeFill: true,
        },
    }
}

interface GenSellAssetsInput extends OrderTime {
    maker: string
    tokenAddress: string
    tokenType: AssetClass
    tokenId: number
    price: string
    /** The ERC-20 token address to buy. If undefined, it will be ETH */
    buyTokenContract?: string
    amount?: number
    salt?: string
    hash?: string
}

export const genSellOrder = (input: GenSellAssetsInput): Order => {
    return {
        itemId: `${input.tokenAddress}:${input.tokenId}`,
        maker: input.maker,
        taker: ZERO_ADDRESS,
        makeAsset: {
            assetType: {
                assetClass: input.tokenType,
                contract: input.tokenAddress,
                tokenId: input.tokenId,
            },
            value: input.amount || 1,
        },
        takeAsset: {
            assetType: {
                assetClass: input.buyTokenContract ? "ERC20" : "ETH",
                contract: input.buyTokenContract,
            },
            value: input.price,
        },
        salt: input.salt || ethers.utils.id(Math.floor(Math.random() * 1000000).toString()),
        start: input.start,
        end: input.end,
        orderType: "RARIBLE_V2",
        side: "Ask",
        signature: "0x",
        data: {
            dataType: "DATA_V2_TYPE",
            payouts: [],
            originFees: [
                {
                    account: "0x67a81B7dD7238DFcD2f3c2EB6fBBD50dBF20444F",
                    value: 250,
                },
            ],
            isMakeFill: true,
        },
        hash: input.hash,
    }
}

export const invertOrder = (maker: string, order: Order): Order => {
    const inverted = {
        ...order,
        maker: maker,
        taker: ZERO_ADDRESS,
        takeAsset: order.makeAsset,
        makeAsset: order.takeAsset,
        signature: "0x",
        data: {
            ...order.data,
            payouts: [],
            originFees: [],
            isMakeFill: !order.data.isMakeFill,
        },
    }
    return inverted
}

export const updateSellOrder = (data: Order, price: string): Order => {
    const sellOrder = genSellOrder({
        maker: data.maker,
        price: ethers.utils.parseEther(price).toString(),
        tokenId: data.makeAsset.assetType.tokenId,
        tokenType: "ERC721",
        tokenAddress: data.makeAsset.assetType.contract,
        start: data.start / 1000,
        end: data.end / 1000,
        salt: data.salt,
        hash: data.hash,
    })

    return sellOrder
}

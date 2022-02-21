import { ethers } from "ethers"
import { ZERO_ADDRESS } from "../constant"
import { Asset, AssetClass, Order } from "../types"

interface GenSellAssetsInput {
    tokenAddress: string
    tokenType: AssetClass
    tokenId: number
    price: string
    /** The ERC-20 token address to buy. If undefined, it will be ETH */
    buyTokenContract?: string
    amount?: number
}

export const genSellAssets = (
    input: GenSellAssetsInput
): {
    makeAsset: Asset
    takeAsset: Asset
} => ({
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
})

interface GenOfferAssetsInput {
    /** ERC-721 or ERC-1155 contract address */
    takeAddress: string
    /** ERC-20 contract address */
    makeAddress: string
    tokenId: number
    price: number | string
    amount?: number
}

export const genOfferAssets = (
    input: GenOfferAssetsInput
): {
    makeAsset: Asset
    takeAsset: Asset
} => ({
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
})

export const genSellOrder = (maker: string, make: Asset, take: Asset, salt?: string): Order => {
    return {
        itemId: `${make.assetType.contract}:${make.assetType.tokenId}`,
        maker: maker,
        makeAsset: make,
        takeAsset: take,
        salt: salt || ethers.utils.id(Math.floor(Math.random() * 1000000).toString()),
        start: Math.floor(Date.now() / 1000),
        end: Math.floor(Date.now() / 1000) + 86400,
        taker: ZERO_ADDRESS,
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
    }
}

export const genOfferOrder = (maker: string, make: Asset, take: Asset): Order => {
    return {
        itemId: `${take.assetType.contract}:${take.assetType.tokenId}`,
        maker: maker,
        makeAsset: make,
        takeAsset: take,
        salt: ethers.utils.id(Math.floor(Math.random() * 1000000).toString()),
        start: Math.floor(Date.now() / 1000),
        end: Math.floor(Date.now() / 1000) + 100000,
        taker: ZERO_ADDRESS,
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
            originFees: [], //order.side === "Ask" ? [] : [{ account: "0x67a81B7dD7238DFcD2f3c2EB6fBBD50dBF20444F", value: 250 }],
            isMakeFill: !order.data.isMakeFill,
        },
    }
    return inverted
}

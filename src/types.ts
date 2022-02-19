export type OrderType = "RARIBLE_V1" | "RARIBLE_V2"

type OrderSide = "Ask" | "Bid" | "Offer"

export type Order = {
    hash?: string
    itemId?: string
    maker: string
    makeAsset: Asset
    takeAsset: Asset
    auctionId?: string
    salt: string
    start: number
    end: number
    data: OrderData
    taker: string
    orderType?: OrderType
    side?: OrderSide
    signature: string
}

type OrderData = {
    dataType: "DATA_V2_TYPE"
    payouts: Payout[]
    originFees: OriginFee[]
    isMakeFill: boolean
}

interface Payout {
    account: string
    value: number
}

interface OriginFee extends Payout {}

export type Asset = {
    assetType: AssetType
    value: number | string
}

export type AssetClass = "ERC721" | "ERC1155" | "ERC20" | "ETH" | "ERC721_LAZY" | "ERC1155_LAZY"

export type AssetType = {
    assetClass: AssetClass
    [key: string]: any
}

export type Auction = {
    id?: string
    contract: string
    tokenId: string
    itemId?: string
    owner: string
    currency: string
    startingValue: string
    start: number
    end: number
    signature?: string
}

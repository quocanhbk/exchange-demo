import { Auction, AssetType } from "../types"
import fetcher from "./fetcher"

export const createAuctionAPI = async (auction: Auction, token: string) => {
    const { data } = await fetcher.post(`/auction/list`, auction, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return data
}

export const updateAuctionAPI = async (auction: Auction, token: string) => {
    const { data } = await fetcher.post(`/auction/reList`, auction, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return data
}

export const getAuctionByItemAPI = async (assetType: AssetType) => {
    const itemId = `${assetType.contract}:${assetType.tokenId}`
    const { data } = await fetcher.get(`/auction/item/${itemId}`)
    return data
}

export const getMessageAuctionAPI = async (auction: Auction) => {
    const { data } = await fetcher.post(`/auction/message`, auction)
    return data
}

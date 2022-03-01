import { Auction, AssetType } from "../types"
import fetcher from "./fetcher"

export const upsertAuctionAPI = async (auction: Auction, token: string) => {
    const { data } = await fetcher.post(`/auction/list`, auction, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return data
}

export const getMessageAuctionAPI = async (auction: Auction) => {
    const { data } = await fetcher.post(`/auction/message`, auction)
    return data
}

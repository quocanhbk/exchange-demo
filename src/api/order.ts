import { ethers } from "ethers"
import { Order, AssetType } from "../types"
import fetcher from "./fetcher"

export const createListing = async (order: Order, token: string) => {
    const { data } = await fetcher.post(`/order/list`, order, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return data
}

export const createOffer = async (order: Order, token: string) => {
    const { data } = await fetcher.post(`/order/offer`, order, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return data
}

export const createBid = async (order: Order, token: string) => {
    const { data } = await fetcher.post(`/order/bid`, order, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return data
}

export const getEncodeDataToSignAPI = async (order: Order) => {
    const { data } = await fetcher.post(`/order/to-sign`, order)
    return data
}

export const getListings = async (itemId: string) => {
    const { data } = await fetcher.get(`/order/ask/${itemId}`)
    return data
}

export const getOffers = async (itemId: string) => {
    const { data } = await fetcher.get(`/order/offers/${itemId}`)
    return data
}

export const getBids = async (itemId: string) => {
    const { data } = await fetcher.get(`/order/bids/${itemId}`)
    return data
}

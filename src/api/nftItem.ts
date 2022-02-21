import fetcher from "./fetcher"

export const getNftItems = async (collectionId: string) => {
    const { data } = await fetcher.get(`/nftitems?take=1000&collectionId=${collectionId}`)
    return data.data
}

export const getNftItem = async (itemId: string) => {
    const { data } = await fetcher.get(`/nftitems/${itemId}`)
    return data
}

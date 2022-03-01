import fetcher from "./fetcher"

export const getNftItems = async (collectionId: string) => {
    const { data } = await fetcher.post(`/nftitems/search`, {
        collections: [collectionId],
        take: 1000,
    })
    return data.data
}

export const getNftItem = async (itemId: string) => {
    const { data } = await fetcher.get(`/nftitems/${itemId}/details`)
    return data
}

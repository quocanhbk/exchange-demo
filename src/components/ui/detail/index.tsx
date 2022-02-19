import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { getListings, getNftItem } from "../../../api"
import { weiToEther } from "../../../contracts"
import useWalletContext from "../../../web3/useWalletContext"
import NftCard from "../home/NftCard"
import ListingCard from "./ListingCard"
import SellModal from "./SellModal"

const DetailUI = ({ id }) => {
    const router = useRouter()
    const wallet = useWalletContext()

    const { data: item } = useQuery(["nft-items", id], () => getNftItem(id), {
        enabled: router.isReady,
    })

    const [isListingCancel, setIsListingCancel] = useState(false)
    const { data: listing } = useQuery(["listing", id], () => getListings(id), {
        enabled: !!id,
        onSuccess: data => {
            console.log("LISTING", data)
            setIsListingCancel(data.status === "Cancelled")
        },
    })

    const [isSelling, setIsSelling] = useState(false)

    const render = () => {
        if (!item) return <Text>Loading...</Text>
        return (
            <Box>
                <NftCard data={item} />
                <HStack mt={4}>
                    {wallet.account === item.owner && !listing && (
                        <Button w="8rem" onClick={() => setIsSelling(true)}>
                            Sell
                        </Button>
                    )}
                </HStack>
            </Box>
        )
    }

    return (
        <Box>
            {render()}
            {listing && !isListingCancel && <ListingCard data={listing} setIsCancelled={setIsListingCancel} />}
            <SellModal
                isOpen={isSelling}
                onClose={() => setIsSelling(false)}
                collectionId={id ? id.split(":")[0] : ""}
                tokenId={id ? id.split(":")[1] : ""}
            />
        </Box>
    )
}

export default DetailUI

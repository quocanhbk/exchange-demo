import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { getListings, getNftItem, getOffers } from "../../../api"
import { weiToEther } from "../../../contracts"
import useWalletContext from "../../../web3/useWalletContext"
import NftCard from "../home/NftCard"
import ListingCard from "./ListingCard"
import OfferCard from "./OfferCard"
import OfferModal from "./OfferModal"
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
            setIsListingCancel(data.status === "Cancelled")
        },
    })

    const { data: offers } = useQuery(["offers", id], () => getOffers(id), {
        enabled: !!id,
    })

    const [isSelling, setIsSelling] = useState(false)

    const [isOffering, setIsOffering] = useState(false)

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
                <HStack align="flex-start" mt={4} spacing={8}>
                    {listing && !isListingCancel && <ListingCard data={listing} setIsCancelled={setIsListingCancel} />}

                    <Box>
                        <Text fontSize="lg" fontWeight="bold" mb={2}>
                            Offers
                        </Text>
                        {offers &&
                            offers.length > 0 &&
                            offers.map((offer, idx) => <OfferCard key={idx} data={offer} owner={item.owner} />)}
                        {wallet.account !== item.owner &&
                            !(offers && offers.some(offer => offer.maker === wallet.account)) && (
                                <Button w="20rem" onClick={() => setIsOffering(true)}>
                                    Make an offer
                                </Button>
                            )}
                    </Box>
                </HStack>
            </Box>
        )
    }

    return (
        <Box>
            {render()}

            <SellModal
                isOpen={isSelling}
                onClose={() => setIsSelling(false)}
                collectionId={id ? id.split(":")[0] : ""}
                tokenId={id ? id.split(":")[1] : ""}
            />
            <OfferModal
                isOpen={isOffering}
                onClose={() => setIsOffering(false)}
                collectionId={id ? id.split(":")[0] : ""}
                tokenId={id ? id.split(":")[1] : ""}
            />
        </Box>
    )
}

export default DetailUI

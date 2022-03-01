import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useState } from "react"
import { useQuery } from "react-query"
import { getNftItem } from "../../../api"
import useWalletContext from "../../../web3/useWalletContext"
import NftCard from "../home/NftCard"
import CreateAuctionModal from "./CreateAuctionModal"
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

    const [isSelling, setIsSelling] = useState(false)

    const [isOffering, setIsOffering] = useState(false)

    const [isAuctioning, setIsAuctioning] = useState(false)

    const render = () => {
        if (!item) return <Text>Loading...</Text>
        return (
            <Box>
                <NftCard data={item.item} />
                <VStack mt={4} align="stretch">
                    {wallet.account === item.item.owner && !item.listing && (
                        <Button onClick={() => setIsSelling(true)} w="20rem">
                            Sell
                        </Button>
                    )}
                    {wallet.account === item.item.owner && !item.auction && (
                        <Button w="20rem" onClick={() => setIsAuctioning(true)}>
                            Create Auction
                        </Button>
                    )}
                </VStack>
                <HStack align="flex-start" mt={4} spacing={8}>
                    {item.listing && !isListingCancel && (
                        <ListingCard data={item.listing} setIsCancelled={setIsListingCancel} />
                    )}

                    <Box>
                        <Text fontSize="lg" fontWeight="bold" mb={2}>
                            Offers
                        </Text>
                        {item.offers.map((offer, idx) => (
                            <OfferCard key={idx} data={offer} owner={item.item.owner} />
                        ))}
                        {wallet.account !== item.item.owner && (
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
            <CreateAuctionModal
                isOpen={isAuctioning}
                onClose={() => setIsAuctioning(false)}
                collectionId={id ? id.split(":")[0] : ""}
                tokenId={id ? id.split(":")[1] : ""}
            />
        </Box>
    )
}

export default DetailUI

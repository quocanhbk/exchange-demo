import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react"
import { format } from "date-fns"
import { useState } from "react"
import { weiToEther } from "../../../contracts"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"
import UpdateSellModal from "./UpdateSellModal"
import useBuyItem from "./useBuyItem"
import useCancelListing from "./useCancelListing"

const ListingCard = ({ data }: { data: Order; setIsCancelled: (value: boolean) => void }) => {
    const wallet = useWalletContext()
    const { isBuying, progress, mutateBuy } = useBuyItem(data)
    const { mutateCancelListing, isCancellingListing } = useCancelListing(data)

    const [isUpdating, setIsUpdating] = useState(false)

    return (
        <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
                Listing
            </Text>
            <VStack align="stretch" w="20rem" rounded="md" p={4} bg="gray.800">
                <Flex align="center" justify="space-between">
                    <Text fontWeight={"semibold"}>Price</Text>
                    <Text>{weiToEther(data.takeAsset.value)}</Text>
                </Flex>
                <Flex align="center" justify="space-between">
                    <Text fontWeight={"semibold"}>Currency</Text>
                    <Text>{data.takeAsset.assetType.assetClass}</Text>
                </Flex>
                <Flex align="center" justify="space-between">
                    <Text fontWeight={"semibold"}>Start</Text>
                    <Text>{format(new Date(data.start), "hh:mm a dd/MM/yyyy")}</Text>
                </Flex>
                <Flex align="center" justify="space-between">
                    <Text fontWeight={"semibold"}>End</Text>
                    <Text>{format(new Date(data.end), "hh:mm a dd/MM/yyyy")}</Text>
                </Flex>
                <Flex align="center" justify="space-between" overflow={"hidden"}>
                    <Text fontWeight={"semibold"}>Seller</Text>
                    <Text flex={1} ml={4} isTruncated color="blue.500">
                        {data.maker}
                    </Text>
                </Flex>
                {wallet.account !== data.maker && (
                    <Button onClick={() => mutateBuy()} isLoading={isBuying} loadingText={progress}>
                        Buy
                    </Button>
                )}
                {wallet.account === data.maker && (
                    <>
                        <Button variant="outline" onClick={() => setIsUpdating(true)}>
                            Update
                        </Button>
                        <Button
                            onClick={() => mutateCancelListing()}
                            isLoading={isCancellingListing}
                            loadingText="Cancelling"
                        >
                            Cancel
                        </Button>
                        <UpdateSellModal isOpen={isUpdating} onClose={() => setIsUpdating(false)} order={data} />
                    </>
                )}
            </VStack>
        </Box>
    )
}

export default ListingCard

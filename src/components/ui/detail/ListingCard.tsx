import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react"
import { format } from "date-fns"
import { weiToEther } from "../../../contracts"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"
import useBuyItem from "./useBuyItem"

const ListingCard = ({ data, setIsCancelled }: { data: Order; setIsCancelled: (value: boolean) => void }) => {
    const wallet = useWalletContext()

    const { handleBuy, isBuying, progress } = useBuyItem(data)

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
                    <Text>{format(new Date(data.start * 1000), "hh:mm a dd/MM/yyyy")}</Text>
                </Flex>
                <Flex align="center" justify="space-between">
                    <Text fontWeight={"semibold"}>End</Text>
                    <Text>{format(new Date(data.end * 1000), "hh:mm a dd/MM/yyyy")}</Text>
                </Flex>
                <Flex align="center" justify="space-between" overflow={"hidden"}>
                    <Text fontWeight={"semibold"}>Seller</Text>
                    <Text flex={1} ml={4} isTruncated color="blue.500">
                        {data.maker}
                    </Text>
                </Flex>
                {wallet.account !== data.maker && (
                    <Button onClick={handleBuy} isLoading={isBuying} loadingText={progress}>
                        Buy
                    </Button>
                )}
            </VStack>
        </Box>
    )
}

export default ListingCard

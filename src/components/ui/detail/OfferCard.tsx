import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react"
import { format } from "date-fns"
import { useMutation } from "react-query"
import { TRANSFER_PROXY_ADDRESS } from "../../../constant"
import { weiToEther } from "../../../contracts"
import { invertOrder } from "../../../helper"
import { useChakraToast } from "../../../hooks"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"

const OfferCard = ({ data, owner }: { data: Order; owner: string }) => {
    const wallet = useWalletContext()
    const toast = useChakraToast()

    const { mutate: mutateCancelOffer, isLoading: isCancellingOffer } = useMutation(() =>
        wallet.scCaller.current!.Exchange.cancelOrder(data as Order)
    )

    const handleCancel = () => {
        if (!wallet.isActive) {
            toast({
                status: "error",
                title: "Please connect to a wallet",
            })
            return
        }
        mutateCancelOffer()
    }

    const accept = async () => {
        const invertedOrder = invertOrder(wallet.account!, data as Order)
        if (data.takeAsset.assetType.assetClass === "ERC721") {
            const { contract } = data.takeAsset.assetType
            const isApproved = await wallet.scCaller.current!.DynamicERC721.isApprovedForAll(
                contract,
                owner,
                TRANSFER_PROXY_ADDRESS
            )
            if (!isApproved) {
                await wallet.scCaller.current!.DynamicERC721.setApprovalForAll(contract, TRANSFER_PROXY_ADDRESS)
            }
        }

        await wallet.scCaller.current!.Exchange.matchOrders(data, data.signature, invertedOrder, "0x")
    }

    const { mutate: mutateAccept, isLoading: isAccepting } = useMutation(() => accept())

    const handleAccept = () => {
        if (!wallet.isActive) {
            toast({
                status: "error",
                title: "Please connect to a wallet",
            })
            return
        }
        mutateAccept()
    }

    return (
        <Box mb={4}>
            <VStack align="stretch" w="20rem" rounded="md" p={4} bg="gray.800">
                <Flex align="center" justify="space-between">
                    <Text fontWeight={"semibold"}>Price</Text>
                    <Text>{weiToEther(data.makeAsset.value)}</Text>
                </Flex>
                <Flex align="center" justify="space-between">
                    <Text fontWeight={"semibold"}>Currency</Text>
                    <Text>{data.makeAsset.assetType.assetClass}</Text>
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
                    <Text fontWeight={"semibold"}>Offerer</Text>
                    <Text flex={1} ml={4} isTruncated color="blue.500">
                        {data.maker}
                    </Text>
                </Flex>
                {wallet.account === data.maker && (
                    <Button onClick={handleCancel} isLoading={isCancellingOffer}>
                        Cancel
                    </Button>
                )}
                {wallet.account === owner && (
                    <Button onClick={handleAccept} isLoading={isAccepting}>
                        Accept this offer
                    </Button>
                )}
            </VStack>
        </Box>
    )
}

export default OfferCard

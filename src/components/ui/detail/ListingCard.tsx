import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react"
import { format } from "date-fns"
import { useMutation } from "react-query"
import { TRANSFER_ERC20_PROXY_ADDRESS } from "../../../constant"
import { weiToEther } from "../../../contracts"
import { invertOrder } from "../../../helper"
import { useChakraToast } from "../../../hooks"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"

const ListingCard = ({ data, setIsCancelled }: { data: Order; setIsCancelled: (value: boolean) => void }) => {
    const wallet = useWalletContext()

    const { mutate, isLoading } = useMutation(() => wallet.scCaller.current!.Exchange.cancelOrder(data as Order), {
        onSuccess: () => setIsCancelled(true),
    })

    const toast = useChakraToast()

    const handleCancel = () => {
        if (!wallet.isActive) {
            toast({
                status: "error",
                title: "Please connect to a wallet",
            })
            return
        }
        mutate()
    }

    const buy = async () => {
        const invertedOrder = invertOrder(wallet.account!, data as Order)

        if (data.takeAsset.assetType.assetClass === "ERC20") {
            const { address } = data.takeAsset.assetType
            const allowance = await wallet.scCaller.current?.DynamicERC20.allowance(
                address,
                wallet.account!,
                TRANSFER_ERC20_PROXY_ADDRESS
            )
            if (allowance?.lt(data.takeAsset.value)) {
                const balance = await wallet.scCaller.current!.DynamicERC20.getBalance(address, wallet.account!)
                await wallet.scCaller.current?.DynamicERC20.approve(address, TRANSFER_ERC20_PROXY_ADDRESS, balance)
            }
        }

        await wallet.scCaller.current!.Exchange.matchOrders(data, data.signature, invertedOrder, "0x")
    }

    const { mutate: mutateBuy, isLoading: isBuying } = useMutation(() => buy())

    const handleBuy = () => {
        if (!wallet.isActive) {
            toast({
                status: "error",
                title: "Please connect to a wallet",
            })
            return
        }
        mutateBuy()
    }

    return (
        <Box mt={4}>
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
                {wallet.account === data.maker && (
                    <Button onClick={handleCancel} isLoading={isLoading}>
                        Cancel
                    </Button>
                )}
                {wallet.account !== data.maker && (
                    <Button onClick={handleBuy} isLoading={isBuying}>
                        Buy
                    </Button>
                )}
            </VStack>
        </Box>
    )
}

export default ListingCard

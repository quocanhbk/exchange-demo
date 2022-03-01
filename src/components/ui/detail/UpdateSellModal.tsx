import { FormControl, FormLabel, Button, ButtonGroup, HStack, Text, FormHelperText } from "@chakra-ui/react"
import { format } from "date-fns"
import { weiToEther } from "../../../contracts"
import { useEthBalance } from "../../../hooks"
import { ChakraModal, CurrencyInput } from "../../shared"
import useUpdateListing from "./useUpdateListing"

const UpdateSellModal = ({ isOpen, onClose, order }) => {
    const { price, setPrice, progress, handleClose, mutateUpdateListing, isUpdatingListing } = useUpdateListing(
        order,
        onClose
    )
    const ethBalance = useEthBalance()
    console.log(order)
    return (
        <ChakraModal title="Create Sell" isOpen={isOpen} onClose={handleClose}>
            <FormControl mb={4}>
                <FormLabel>Currency</FormLabel>
                <ButtonGroup isAttached>
                    <Button variant={order.takeAsset.assetType.assetClass === "ETH" ? "solid" : "outline"}>ETH</Button>
                    <Button variant={order.takeAsset.assetType.assetClass !== "ETH" ? "solid" : "outline"}>WETH</Button>
                </ButtonGroup>
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Price</FormLabel>
                <CurrencyInput value={price} setValue={setPrice} maxValue={weiToEther(ethBalance)} />
                <FormHelperText>
                    New price must be less than the current price: {weiToEther(order.takeAsset.value)}
                </FormHelperText>
            </FormControl>
            <Text mb={2}>Start time: {format(new Date(order.start), "hh:mm a dd/MM/yyyy")}</Text>
            <Text mb={4}>End time: {format(new Date(order.end), "hh:mm a dd/MM/yyyy")}</Text>
            <HStack>
                <Button
                    w="8rem"
                    onClick={() => mutateUpdateListing()}
                    isLoading={isUpdatingListing}
                    loadingText={progress || "Loading"}
                >
                    Confirm
                </Button>
            </HStack>
        </ChakraModal>
    )
}

export default UpdateSellModal

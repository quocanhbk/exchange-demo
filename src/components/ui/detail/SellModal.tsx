import { FormControl, FormLabel, Button, ButtonGroup, HStack, Text } from "@chakra-ui/react"
import { weiToEther } from "../../../contracts"
import { useEthBalance } from "../../../hooks"
import { ChakraModal, CurrencyInput } from "../../shared"
import useCreateListing from "./useCreateListing"

const SellModal = ({ isOpen, onClose, collectionId, tokenId }) => {
    const { currency, setCurrency, price, setPrice, mutateCreateListing, isCreatingListing, progress, handleClose } =
        useCreateListing(collectionId, tokenId, onClose)
    const ethBalance = useEthBalance()

    return (
        <ChakraModal title="Create Sell" isOpen={isOpen} onClose={handleClose}>
            <FormControl mb={4}>
                <FormLabel>Currency</FormLabel>
                <ButtonGroup isAttached>
                    <Button variant={currency === "ETH" ? "solid" : "outline"} onClick={() => setCurrency("ETH")}>
                        ETH
                    </Button>
                    <Button variant={currency === "WETH" ? "solid" : "outline"} onClick={() => setCurrency("WETH")}>
                        WETH
                    </Button>
                </ButtonGroup>
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Price</FormLabel>
                <CurrencyInput value={price} setValue={setPrice} maxValue={weiToEther(ethBalance)} />
            </FormControl>
            <Text mb={4} fontSize="sm" color="whiteAlpha.500">
                Start time is now, end time is a day later.
            </Text>
            <HStack>
                <Button
                    w="8rem"
                    onClick={() => mutateCreateListing()}
                    isLoading={isCreatingListing}
                    loadingText={progress || "Loading"}
                >
                    Confirm
                </Button>
            </HStack>
        </ChakraModal>
    )
}

export default SellModal

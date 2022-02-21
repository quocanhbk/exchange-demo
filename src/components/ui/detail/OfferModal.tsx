import { FormControl, FormLabel, Button, ButtonGroup, HStack, Text } from "@chakra-ui/react"
import { useWethBalance } from "../../../hooks"
import { ChakraModal, CurrencyInput } from "../../shared"
import useCreateOffer from "./useCreateOffer"

const OfferModal = ({ isOpen, onClose, collectionId, tokenId }) => {
    const { price, setPrice, handleCreateOffer, isCreatingOffer, progress } = useCreateOffer(
        collectionId,
        tokenId,
        onClose
    )

    const wethBalance = useWethBalance()

    return (
        <ChakraModal title="Create Offer" isOpen={isOpen} onClose={onClose}>
            <FormControl mb={4}>
                <FormLabel>Currency</FormLabel>
                <ButtonGroup isAttached>
                    <Button variant={"outline"} isDisabled>
                        ETH
                    </Button>
                    <Button variant={"solid"}>WETH</Button>
                </ButtonGroup>
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Price</FormLabel>
                <CurrencyInput value={price} setValue={setPrice} maxValue={wethBalance} />
            </FormControl>
            <Text mb={4} fontSize="sm" color="whiteAlpha.500">
                Start time is now, end time is a day later.
            </Text>
            <HStack>
                <Button
                    w="8rem"
                    onClick={() => handleCreateOffer()}
                    isLoading={isCreatingOffer}
                    loadingText={progress}
                    isDisabled={parseFloat(price) <= 0}
                >
                    Confirm
                </Button>
            </HStack>
        </ChakraModal>
    )
}

export default OfferModal

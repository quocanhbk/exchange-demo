import { FormControl, FormLabel, Button, ButtonGroup, HStack, Text } from "@chakra-ui/react"
import { weiToEther } from "../../../contracts"
import { useEthBalance } from "../../../hooks"
import { ChakraModal, CurrencyInput } from "../../shared"
import useCreateAuction from "./useCreateAuction"

const CreateAuctionModal = ({ isOpen, onClose, collectionId, tokenId }) => {
    const { mutateCreateAuction, isCreatingAuction, handleClose, price, progress, setPrice } = useCreateAuction(
        collectionId,
        tokenId,
        onClose
    )
    const ethBalance = useEthBalance()
    return (
        <ChakraModal title="Create Sell" isOpen={isOpen} onClose={handleClose}>
            <FormControl mb={4}>
                <FormLabel>Currency</FormLabel>
                <ButtonGroup isAttached>
                    <Button variant="outline">ETH</Button>
                    <Button variant="solid">WETH</Button>
                </ButtonGroup>
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Starting price</FormLabel>
                <CurrencyInput value={price} setValue={setPrice} maxValue={weiToEther(ethBalance)} />
            </FormControl>
            <Text mb={4} fontSize="sm" color="whiteAlpha.500">
                Start time is now, end time is a day later.
            </Text>
            <HStack>
                <Button
                    w="8rem"
                    onClick={() => mutateCreateAuction()}
                    isLoading={isCreatingAuction}
                    loadingText={progress}
                >
                    Confirm
                </Button>
            </HStack>
        </ChakraModal>
    )
}

export default CreateAuctionModal

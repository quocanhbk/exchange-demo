import { FormControl, FormLabel, Button, ButtonGroup, HStack, Text } from "@chakra-ui/react"
import { useState } from "react"
import { ethers } from "ethers"
import { createListing, createOffer, getEncodeDataToSignAPI } from "../../../api"
import { EXCHANGE_V2_ADDRESS, TRANSFER_PROXY_ADDRESS, WETH_ADDRESS } from "../../../constant"
import { genOfferAssets, genOfferOrder, genSellAssets, genSellOrder, signOrder } from "../../../helper"
import { useEthBalance, useWethBalance } from "../../../hooks"
import useWalletContext from "../../../web3/useWalletContext"
import { getToken } from "../../../web3/utils"
import { ChakraModal, CurrencyInput } from "../../shared"
import { useMutation, useQueryClient } from "react-query"

const OfferModal = ({ isOpen, onClose, collectionId, tokenId }) => {
    const [price, setPrice] = useState("0")
    const wallet = useWalletContext()
    const qc = useQueryClient()

    const createSellOffer = async () => {
        // make sure contract is approved to use user's nft
        const isApproved = wallet.scCaller.current?.DynamicERC721.isApprovedForAll(
            collectionId,
            wallet.account as string,
            TRANSFER_PROXY_ADDRESS
        )
        if (!isApproved) {
            wallet.scCaller.current?.DynamicERC721.setApprovalForAll(collectionId, wallet.account as string)
        }

        const assets = genOfferAssets({
            makeAddress: WETH_ADDRESS,
            price: ethers.utils.parseEther(price).toString(),
            takeAddress: collectionId,
            tokenId,
        })

        const offerOrder = genOfferOrder(wallet.account as string, assets.makeAsset, assets.takeAsset)

        const encodedData = await getEncodeDataToSignAPI(offerOrder)

        const signature = await signOrder(
            wallet.ethereum,
            wallet.account as string,
            { chainId: 4, exchange: EXCHANGE_V2_ADDRESS },
            encodedData
        )
        offerOrder.signature = signature

        const token = getToken()
        if (!token) return

        await createOffer(offerOrder, token)
    }

    const { mutate, isLoading } = useMutation(() => createSellOffer(), {
        onSuccess: () => {
            qc.invalidateQueries("listing")
            onClose()
        },
    })

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
                <Button w="8rem" onClick={() => mutate()} isLoading={isLoading}>
                    Confirm
                </Button>
            </HStack>
        </ChakraModal>
    )
}

export default OfferModal

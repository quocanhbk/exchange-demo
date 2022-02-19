import { FormControl, FormLabel, Button, ButtonGroup, HStack } from "@chakra-ui/react"
import { useState } from "react"
import { ethers } from "ethers"
import { createListing, getEncodeDataToSignAPI } from "../../../api"
import { EXCHANGE_V2_ADDRESS, TRANSFER_PROXY_ADDRESS, WETH_ADDRESS } from "../../../constant"
import { genSellAssets, genSellOrder, signOrder } from "../../../helper"
import { useEthBalance } from "../../../hooks"
import useWalletContext from "../../../web3/useWalletContext"
import { getToken } from "../../../web3/utils"
import { ChakraModal, CurrencyInput } from "../../shared"
import { useMutation, useQueryClient } from "react-query"

const SellModal = ({ isOpen, onClose, collectionId, tokenId }) => {
    const [price, setPrice] = useState("0")
    const [currency, setCurrency] = useState("ETH")
    const wallet = useWalletContext()
    const qc = useQueryClient()

    const createSellOrder = async () => {
        // make sure contract is approved to use user's nft
        const isApproved = wallet.scCaller.current?.DynamicERC721.isApprovedForAll(
            collectionId,
            wallet.account as string,
            TRANSFER_PROXY_ADDRESS
        )
        if (!isApproved) {
            wallet.scCaller.current?.DynamicERC721.setApprovalForAll(collectionId, wallet.account as string)
        }

        const assets = genSellAssets({
            price: ethers.utils.parseEther(price).toString(),
            tokenAddress: collectionId,
            tokenId,
            tokenType: "ERC721",
            amount: 1,
            buyTokenContract: currency === "WETH" ? WETH_ADDRESS : undefined,
        })

        const sellOrder = genSellOrder(wallet.account as string, assets.makeAsset, assets.takeAsset)

        const encodedData = await getEncodeDataToSignAPI(sellOrder)

        const signature = await signOrder(
            wallet.ethereum,
            wallet.account as string,
            { chainId: 4, exchange: EXCHANGE_V2_ADDRESS },
            encodedData
        )
        sellOrder.signature = signature

        const token = getToken()
        if (!token) return

        await createListing(sellOrder, token)
    }

    const { mutate, isLoading } = useMutation(() => createSellOrder(), {
        onSuccess: () => {
            qc.invalidateQueries("listing")
            onClose()
        },
    })

    const ethBalance = useEthBalance()

    return (
        <ChakraModal title="Create Sell" isOpen={isOpen} onClose={onClose}>
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
                <CurrencyInput value={price} setValue={setPrice} maxValue={ethBalance} />
            </FormControl>
            <HStack>
                <Button w="8rem" onClick={() => mutate()} isLoading={isLoading}>
                    Confirm
                </Button>
            </HStack>
        </ChakraModal>
    )
}

export default SellModal

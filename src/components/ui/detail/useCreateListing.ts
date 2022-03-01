import { ethers } from "ethers"
import { useState } from "react"
import { useQueryClient, useMutation } from "react-query"
import { getEncodeDataToSignAPI, createListing } from "../../../api"
import { TRANSFER_PROXY_ADDRESS, EXCHANGE_V2_ADDRESS } from "../../../constant"
import { genSellOrder, signOrder } from "../../../helper"
import { useChakraToast } from "../../../hooks"
import useWalletContext from "../../../web3/useWalletContext"
import { getToken } from "../../../web3/utils"

// Checking - Approving - Signing - Creating
const useCreateListing = (collectionId: string, tokenId: number, onClose: () => void) => {
    const [price, setPrice] = useState("0")
    const [currency, setCurrency] = useState("ETH")
    const wallet = useWalletContext()
    const qc = useQueryClient()
    const toast = useChakraToast()

    const [progress, setProgress] = useState("Loading")

    const createSellOrder = async () => {
        if (!wallet.isActive) throw new Error("Please connect to a wallet")

        // make sure contract is approved to use user's nft
        const isApproved = await wallet.scCaller.current?.DynamicERC721.isApprovedForAll(
            collectionId,
            wallet.account as string,
            TRANSFER_PROXY_ADDRESS
        )
        if (!isApproved) {
            setProgress("Approving")
            await wallet.scCaller.current?.DynamicERC721.setApprovalForAll(collectionId, TRANSFER_PROXY_ADDRESS)
        }
        setProgress("Signing")

        const sellOrder = genSellOrder({
            maker: wallet.account as string,
            price: ethers.utils.parseEther(price).toString(),
            tokenId,
            tokenType: "ERC721",
            tokenAddress: collectionId,
            start: Math.floor(Date.now() / 1000),
            end: Math.floor(Date.now() / 1000) + 86400,
        })

        const encodedData = await getEncodeDataToSignAPI(sellOrder)

        const signature = await signOrder(
            wallet.ethereum,
            wallet.account as string,
            { chainId: 4, exchange: EXCHANGE_V2_ADDRESS },
            encodedData
        )
        sellOrder.signature = signature

        setProgress("Creating")
        const token = getToken()
        if (!token) return
        await createListing(sellOrder, token)
    }

    const { mutate: mutateCreateListing, isLoading: isCreatingListing } = useMutation(() => createSellOrder(), {
        onSuccess: () => {
            qc.invalidateQueries(["nft-items", `${collectionId}:${tokenId}`])
            toast({
                status: "success",
                title: "Create listing successfully!",
            })
            onClose()
        },
        onError: (e: any) => {
            console.log(e)
            toast({
                status: "error",
                title: e.message || "Create listing failed!",
            })
        },
        onSettled: () => {
            setProgress("Loading")
        },
    })

    const handleClose = () => {
        if (isCreatingListing) return
        onClose()
    }

    return {
        currency,
        setCurrency,
        price,
        setPrice,
        mutateCreateListing,
        isCreatingListing,
        progress,
        handleClose,
    }
}

export default useCreateListing

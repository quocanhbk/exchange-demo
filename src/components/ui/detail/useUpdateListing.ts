import { ethers } from "ethers"
import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { createListing, getEncodeDataToSignAPI } from "../../../api"
import { EXCHANGE_V2_ADDRESS } from "../../../constant"
import { signOrder, updateSellOrder } from "../../../helper"
import { useChakraToast } from "../../../hooks"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"
import { getToken } from "../../../web3/utils"

const useUpdateListing = (data: Order, onClose: () => void) => {
    const wallet = useWalletContext()
    const qc = useQueryClient()
    const toast = useChakraToast()
    const [price, setPrice] = useState("0")
    const [progress, setProgress] = useState<null | string>(null)

    const handleUpdateSellOrder = async () => {
        if (!wallet.isActive) throw new Error("Please connect to a wallet")
        if (ethers.utils.parseEther(price).gte(data.takeAsset.value))
            throw new Error("Price must be less than current price")

        const newOrder = updateSellOrder(data, price)

        setProgress("Signing")
        const encodedData = await getEncodeDataToSignAPI(newOrder)
        const signature = await signOrder(
            wallet.ethereum,
            wallet.account as string,
            { chainId: 4, exchange: EXCHANGE_V2_ADDRESS },
            encodedData
        )
        newOrder.signature = signature

        setProgress("Updating")
        const token = getToken()
        if (!token) return
        await createListing(newOrder, token)
    }

    const [collectionId, tokenId] = data.itemId!.split(":")
    const { mutate: mutateUpdateListing, isLoading: isUpdatingListing } = useMutation(() => handleUpdateSellOrder(), {
        onSuccess: () => {
            qc.invalidateQueries(["nft-items", `${collectionId}:${tokenId}`])
            toast({
                status: "success",
                title: "Update listing successfully!",
            })
            onClose()
            setProgress(null)
        },
        onError: (e: any) => {
            const errorMessage = e?.response ? e.response.data.message : e?.message || "Update listing failed"
            toast({
                status: "error",
                title: errorMessage,
            })
        },
    })

    const handleClose = () => {
        if (!!progress) return
        onClose()
    }

    return {
        price,
        setPrice,
        mutateUpdateListing,
        isUpdatingListing,
        progress,
        handleClose,
    }
}

export default useUpdateListing

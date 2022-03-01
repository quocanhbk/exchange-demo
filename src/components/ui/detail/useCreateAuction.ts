import { ethers } from "ethers"
import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { getMessageAuctionAPI, upsertAuctionAPI } from "../../../api"
import { WETH_ADDRESS } from "../../../constant"
import { useChakraToast } from "../../../hooks"
import { Auction } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"
import { getToken } from "../../../web3/utils"

const useCreateAuction = (collectionId: string, tokenId: number, onClose: () => void) => {
    const [price, setPrice] = useState("0")
    const wallet = useWalletContext()
    const qc = useQueryClient()
    const toast = useChakraToast()

    const [progress, setProgress] = useState("Loading")

    const createAuction = async () => {
        if (!wallet.isActive) throw new Error("Please connect to a wallet")

        const auction: Auction = {
            contract: collectionId,
            owner: wallet.account!,
            currency: WETH_ADDRESS,
            startingValue: ethers.utils.parseEther(price).toString(),
            tokenId,
            start: Math.floor(Date.now()),
            end: Math.floor(Date.now()) + 86400000,
        }
        setProgress("Signing")
        const message = await getMessageAuctionAPI(auction)
        auction.signature = await wallet.scCaller.current?.sign(message)
        const token = getToken()
        if (!token) return
        setProgress("Creating")
        await upsertAuctionAPI(auction, token)
    }

    const { mutate: mutateCreateAuction, isLoading: isCreatingAuction } = useMutation(() => createAuction(), {
        onSuccess: () => {
            qc.invalidateQueries(["nft-items", `${collectionId}:${tokenId}`])
            toast({
                status: "success",
                title: "Create auction successfully!",
            })
            onClose()
        },
        onError: (e: any) => {
            toast({
                status: "error",
                title: e.message || "Create auction failed!",
            })
        },
        onSettled: () => {
            setProgress("Loading")
        },
    })

    const handleClose = () => {
        if (isCreatingAuction) return
        onClose()
    }

    return {
        progress,
        price,
        setPrice,
        mutateCreateAuction,
        isCreatingAuction,
        handleClose,
    }
}

export default useCreateAuction

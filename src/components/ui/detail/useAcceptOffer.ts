import { useState } from "react"
import { useMutation } from "react-query"
import { TRANSFER_PROXY_ADDRESS } from "../../../constant"
import { invertOrder } from "../../../helper"
import { useChakraToast } from "../../../hooks"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"

const useAcceptOffer = (data: Order, owner: string) => {
    const wallet = useWalletContext()
    const toast = useChakraToast()
    const [progress, setProgress] = useState("Checking")

    const accept = async () => {
        if (!wallet.isActive) return new Error("Please connect to a wallet")

        const order: Order = { ...data, start: data.start / 1000, end: data.end / 1000 }
        const invertedOrder = invertOrder(wallet.account!, order as Order)

        if (order.takeAsset.assetType.assetClass === "ERC721") {
            const { contract } = order.takeAsset.assetType
            const isApproved = await wallet.scCaller.current!.DynamicERC721.isApprovedForAll(
                contract,
                owner,
                TRANSFER_PROXY_ADDRESS
            )
            if (!isApproved) {
                setProgress("Approving")
                await wallet.scCaller.current!.DynamicERC721.setApprovalForAll(contract, TRANSFER_PROXY_ADDRESS)
            }
        }
        setProgress("Matching")
        await wallet.scCaller.current!.Exchange.matchOrders(order, order.signature, invertedOrder, "0x")
    }

    const { mutate: mutateAccept, isLoading: isAccepting } = useMutation(() => accept(), {
        onSuccess: () => {
            toast({
                status: "success",
                title: "Offer accepted successfully",
                description: "Please refresh after a few seconds to see the changes",
                duration: 5000,
            })
        },
        onError: (e: any) => {
            console.log(e)
            toast({
                status: "error",
                title: e.message || "Offer accept failed",
            })
        },
    })

    return {
        mutateAccept,
        isAccepting,
        progress,
    }
}

export default useAcceptOffer

import { useState } from "react"
import { useMutation } from "react-query"
import { useChakraToast } from "../../../hooks"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"

const useCancelOffer = (data: Order) => {
    const wallet = useWalletContext()
    const toast = useChakraToast()
    const cancelOffer = async () => {
        if (!wallet.isActive) throw new Error("Please connect to a wallet")
        await wallet.scCaller.current!.Exchange.cancelOrder(data)
    }

    const { mutate: mutateCancelOffer, isLoading: isCancellingOffer } = useMutation(cancelOffer, {
        onSuccess: () => {
            toast({ status: "success", title: "Offer cancelled" })
        },
        onError: (e: any) => {
            toast({ status: "error", title: e.message })
        },
    })

    return {
        mutateCancelOffer,
        isCancellingOffer,
    }
}

export default useCancelOffer

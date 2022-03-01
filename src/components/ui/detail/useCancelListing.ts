import { useMutation } from "react-query"
import { useChakraToast } from "../../../hooks"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"

const useCancelListing = (data: Order) => {
    const wallet = useWalletContext()
    const toast = useChakraToast()

    const cancelListing = async () => {
        if (!wallet.isActive) throw new Error("Please connect to a wallet")
        await wallet.scCaller.current!.Exchange.cancelOrder(data)
    }

    const { mutate: mutateCancelListing, isLoading: isCancellingListing } = useMutation(cancelListing, {
        onSuccess: () => {
            toast({
                status: "success",
                title: "Offer cancelled",
                description: "Please refresh after a few seconds to see the changes",
            })
        },
        onError: (e: any) => {
            toast({ status: "error", title: e.message })
        },
    })

    return {
        mutateCancelListing,
        isCancellingListing,
    }
}

export default useCancelListing

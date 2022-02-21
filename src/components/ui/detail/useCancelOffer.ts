import { useMutation } from "react-query"
import { useChakraToast } from "../../../hooks"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"

const useCancelOffer = (data: Order) => {
    const wallet = useWalletContext()
    const toast = useChakraToast()

    const cancelOffer = () =>
        new Promise(async (resolve, reject) => {
            if (!wallet.isActive) {
                toast({
                    status: "error",
                    title: "Please connect to a wallet",
                })
                reject()
            }
            try {
                await wallet.scCaller.current!.Exchange.cancelOrder(data)
                const contract = wallet.scCaller.current!.Exchange.getContract()
                const filter = contract.filters.Cancel(null, wallet.account)
                return
                contract.once(filter, () => {
                    resolve("Success")
                })
            } catch (e) {
                reject(e)
            }
        })

    const { mutate: mutateCancelOffer, isLoading: isCancellingOffer } = useMutation(cancelOffer)

    return {
        mutateCancelOffer,
        isCancellingOffer,
    }
}

export default useCancelOffer

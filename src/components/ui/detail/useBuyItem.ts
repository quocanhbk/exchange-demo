import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { TRANSFER_ERC20_PROXY_ADDRESS } from "../../../constant"
import { invertOrder } from "../../../helper"
import { useChakraToast } from "../../../hooks"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"

const useBuyItem = (data: Order) => {
    const wallet = useWalletContext()
    const toast = useChakraToast()
    const [progress, setProgress] = useState("Checking")

    const buy = async () => {
        if (!wallet.isActive) throw new Error("Please connect to a wallet")

        const order: Order = { ...data, start: data.start / 1000, end: data.end / 1000 }
        const invertedOrder = invertOrder(wallet.account!, order as Order)

        // if bought by erc20, need to approve
        if (order.takeAsset.assetType.assetClass === "ERC20") {
            const { contract } = order.takeAsset.assetType

            const allowance = await wallet.scCaller.current?.DynamicERC20.allowance(
                contract,
                wallet.account!,
                TRANSFER_ERC20_PROXY_ADDRESS
            )
            if (allowance?.lt(order.takeAsset.value)) {
                setProgress("Approving")
                const balance = await wallet.scCaller.current!.DynamicERC20.getBalance(contract, wallet.account!)
                await wallet.scCaller.current?.DynamicERC20.approve(contract, TRANSFER_ERC20_PROXY_ADDRESS, balance)
            }
        }
        setProgress("Matching")
        await wallet.scCaller.current!.Exchange.matchOrders(order, order.signature, invertedOrder, "0x")
    }

    const { mutate: mutateBuy, isLoading: isBuying } = useMutation(() => buy(), {
        onSuccess: () => {
            toast({
                status: "success",
                title: "Buy successfully!",
                description: "Please refresh after a few seconds to see the changes",
            })
        },
        onError: (e: any) => {
            console.log(e)
            toast({
                status: "error",
                title: e.message || "Buy failed!",
            })
        },
    })

    return {
        isBuying,
        progress,
        mutateBuy,
    }
}

export default useBuyItem

import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { TRANSFER_ERC20_PROXY_ADDRESS } from "../../../constant"
import { invertOrder } from "../../../helper"
import { useChakraToast } from "../../../hooks"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"

const useBuyItem = (data: Order) => {
    const wallet = useWalletContext()
    const toast = useChakraToast()
    const qc = useQueryClient()
    const [progress, setProgress] = useState("Approving")

    const buy = () =>
        new Promise(async (resolve, reject) => {
            const invertedOrder = invertOrder(wallet.account!, data as Order)
            try {
                // if bought by erc20, need to approve
                if (data.takeAsset.assetType.assetClass === "ERC20") {
                    const { contract } = data.takeAsset.assetType

                    const allowance = await wallet.scCaller.current?.DynamicERC20.allowance(
                        contract,
                        wallet.account!,
                        TRANSFER_ERC20_PROXY_ADDRESS
                    )
                    if (allowance?.lt(data.takeAsset.value)) {
                        const balance = await wallet.scCaller.current!.DynamicERC20.getBalance(
                            contract,
                            wallet.account!
                        )
                        await wallet.scCaller.current?.DynamicERC20.approve(
                            contract,
                            TRANSFER_ERC20_PROXY_ADDRESS,
                            balance
                        )
                        const contractObj = wallet.scCaller.current!.DynamicERC20.getContract(contract)
                        const filter = contractObj.filters.Approval(
                            wallet.account!,
                            TRANSFER_ERC20_PROXY_ADDRESS,
                            balance
                        )
                        contractObj.once(filter, () => {
                            setProgress("Matching")
                        })
                    } else {
                        setProgress("Matching")
                    }
                } else {
                    setProgress("Matching")
                }
                // listen to transfer event on the contract of the selling item
                const contract = wallet.scCaller.current!.DynamicERC721.getContract(data.makeAsset.assetType.contract)
                const filter = contract.filters.Transfer(
                    data.maker,
                    wallet.account,
                    parseInt(data.makeAsset.assetType.tokenId)
                )
                contract.once(filter, () => {
                    resolve("Success")
                })
                await wallet.scCaller.current!.Exchange.matchOrders(data, data.signature, invertedOrder, "0x")
            } catch (e) {
                reject(e)
            }
        })

    const { mutate: mutateBuy, isLoading: isBuying } = useMutation(() => buy(), {
        onSuccess: () => {
            toast({
                status: "success",
                title: "Buy successfully!",
            })
            qc.invalidateQueries("listing")
        },
        onError: (e: any) => {
            console.log(e)
            toast({
                status: "error",
                title: e.message || "Buy failed!",
            })
        },
    })

    const handleBuy = () => {
        if (!wallet.isActive) {
            toast({
                status: "error",
                title: "Please connect to a wallet",
            })
            return
        }
        mutateBuy()
    }

    return {
        handleBuy,
        isBuying,
        progress,
    }
}

export default useBuyItem

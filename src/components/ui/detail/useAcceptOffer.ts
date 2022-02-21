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
    const [progress, setProgress] = useState("Approving")

    const accept = () =>
        new Promise(async (resolve, reject) => {
            if (!wallet.isActive) {
                toast({
                    status: "error",
                    title: "Please connect to a wallet",
                })
                reject()
            }
            const invertedOrder = invertOrder(wallet.account!, data as Order)
            try {
                if (data.takeAsset.assetType.assetClass === "ERC721") {
                    const { contract } = data.takeAsset.assetType
                    const isApproved = await wallet.scCaller.current!.DynamicERC721.isApprovedForAll(
                        contract,
                        owner,
                        TRANSFER_PROXY_ADDRESS
                    )
                    if (!isApproved) {
                        await wallet.scCaller.current!.DynamicERC721.setApprovalForAll(contract, TRANSFER_PROXY_ADDRESS)
                        const contractObj = wallet.scCaller.current!.DynamicERC20.getContract(contract)
                        const filter = contractObj.filters.ApprovalForAll(contract, TRANSFER_PROXY_ADDRESS, true)
                        contractObj.once(filter, () => {
                            setProgress("Matching")
                        })
                    } else setProgress("Matching")
                } else setProgress("Matching")

                const contract = wallet.scCaller.current!.DynamicERC721.getContract(data.takeAsset.assetType.contract)
                const filter = contract.filters.Transfer(
                    wallet.account,
                    data.maker,
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

    const { mutate: mutateAccept, isLoading: isAccepting } = useMutation(() => accept())

    return {
        mutateAccept,
        isAccepting,
        progress,
    }
}

export default useAcceptOffer

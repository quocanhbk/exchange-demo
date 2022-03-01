import { ethers } from "ethers"
import { useState } from "react"
import { useQueryClient, useMutation } from "react-query"
import { getEncodeDataToSignAPI, createOffer } from "../../../api"
import { WETH_ADDRESS, EXCHANGE_V2_ADDRESS, TRANSFER_ERC20_PROXY_ADDRESS } from "../../../constant"
import { genOfferOrder, signOrder } from "../../../helper"
import useWalletContext from "../../../web3/useWalletContext"
import { getToken } from "../../../web3/utils"
import { useChakraToast, useWethBalance } from "../../../hooks"

const useCreateOffer = (collectionId: string, tokenId: number, onClose: () => void) => {
    const [price, setPrice] = useState("0")
    const wallet = useWalletContext()
    const qc = useQueryClient()
    const toast = useChakraToast()
    const [progress, setProgress] = useState<null | string>(null)
    const weth = useWethBalance()

    const createSellOffer = async () => {
        if (!wallet.isActive) throw new Error("Please connect to a wallet")

        const allowance = await wallet.scCaller.current!.DynamicERC20.allowance(
            WETH_ADDRESS,
            wallet.account!,
            TRANSFER_ERC20_PROXY_ADDRESS
        )

        if (allowance?.lt(ethers.utils.parseEther(price))) {
            if (weth.lt(ethers.utils.parseEther(price))) {
                toast({
                    status: "error",
                    title: "Insufficient WETH",
                })
                return
            }

            setProgress("Approving")
            await wallet.scCaller.current?.DynamicERC20.approve(
                WETH_ADDRESS,
                TRANSFER_ERC20_PROXY_ADDRESS,
                ethers.utils.parseEther(weth.toString())!
            )
        }

        setProgress("Signing")

        const offerOrder = genOfferOrder({
            maker: wallet.account!,
            makeAddress: WETH_ADDRESS,
            price: ethers.utils.parseEther(price).toString(),
            takeAddress: collectionId,
            tokenId,
            start: Math.floor(Date.now() / 1000),
            end: Math.floor(Date.now() / 1000) + 86400,
        })

        const encodedData = await getEncodeDataToSignAPI(offerOrder)

        const signature = await signOrder(
            wallet.ethereum,
            wallet.account as string,
            { chainId: 4, exchange: EXCHANGE_V2_ADDRESS },
            encodedData
        )
        offerOrder.signature = signature

        setProgress("Creating")
        const token = getToken()
        if (!token) return

        await createOffer(offerOrder, token)
    }

    const { mutate: mutateCreateOffer, isLoading: isCreatingOffer } = useMutation(() => createSellOffer(), {
        onSuccess: () => {
            qc.invalidateQueries(["nft-items", `${collectionId}:${tokenId}`])
            onClose()
            toast({
                status: "success",
                title: "Create offer successfully!",
            })
        },
        onError: (e: any) => {
            console.log(e)
            toast({
                status: "error",
                title: e.message || "Create offer failed!",
            })
        },
        onSettled: () => {
            setProgress(null)
        },
    })

    const handleClose = () => {
        if (!!progress) return
        onClose()
    }

    return {
        price,
        setPrice,
        mutateCreateOffer,
        isCreatingOffer,
        progress,
        handleClose,
    }
}

export default useCreateOffer

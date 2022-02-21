import { ethers } from "ethers"
import { useState } from "react"
import { useQueryClient, useMutation } from "react-query"
import { getEncodeDataToSignAPI, createOffer } from "../../../api"
import {
    TRANSFER_PROXY_ADDRESS,
    WETH_ADDRESS,
    EXCHANGE_V2_ADDRESS,
    TRANSFER_ERC20_PROXY_ADDRESS,
} from "../../../constant"
import { genOfferAssets, genOfferOrder, signOrder } from "../../../helper"
import useWalletContext from "../../../web3/useWalletContext"
import { getToken } from "../../../web3/utils"
import { useChakraToast, useWethBalance } from "../../../hooks"
import { rejects } from "assert"

const useCreateOffer = (collectionId: string, tokenId: number, onClose: () => void) => {
    const [price, setPrice] = useState("0")
    const wallet = useWalletContext()
    const qc = useQueryClient()
    const toast = useChakraToast()
    const [progress, setProgress] = useState("Approving")
    const weth = useWethBalance()

    const createSellOffer = async () => {
        const allowance = await wallet.scCaller.current!.DynamicERC20.allowance(
            WETH_ADDRESS,
            wallet.account!,
            TRANSFER_ERC20_PROXY_ADDRESS
        )

        if (allowance?.lt(ethers.utils.parseEther(price))) {
            if (ethers.utils.parseEther(weth.toString())?.lt(ethers.utils.parseEther(price))) {
                toast({
                    status: "error",
                    title: "Insufficient WETH",
                })
                return
            }

            await wallet.scCaller.current?.DynamicERC20.approve(
                WETH_ADDRESS,
                TRANSFER_ERC20_PROXY_ADDRESS,
                ethers.utils.parseEther(weth.toString())!
            )
            const contractObj = wallet.scCaller.current!.DynamicERC20.getContract(WETH_ADDRESS)
            const filter = contractObj.filters.Approval(
                wallet.account!,
                TRANSFER_ERC20_PROXY_ADDRESS,
                ethers.utils.parseEther(weth.toString())!
            )
            contractObj.once(filter, () => {
                setProgress("Signing")
            })
        } else setProgress("Signing")

        const assets = genOfferAssets({
            makeAddress: WETH_ADDRESS,
            price: ethers.utils.parseEther(price).toString(),
            takeAddress: collectionId,
            tokenId,
        })

        const offerOrder = genOfferOrder(wallet.account as string, assets.makeAsset, assets.takeAsset)
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
            qc.invalidateQueries("offers")
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
    })

    const handleCreateOffer = () => {
        if (!wallet.isActive) {
            toast({
                status: "error",
                title: "Please connect to a wallet",
            })
            return
        }
        if (parseFloat(price) > weth) {
            toast({
                status: "error",
                title: "Not enough WETH",
            })
            return
        }
        mutateCreateOffer()
    }

    return {
        price,
        setPrice,
        handleCreateOffer,
        isCreatingOffer,
        progress,
    }
}

export default useCreateOffer

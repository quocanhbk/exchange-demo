import { ethers } from "ethers"
import { useState } from "react"
import { useQueryClient, useMutation } from "react-query"
import { getEncodeDataToSignAPI, createListing } from "../../../api"
import { TRANSFER_PROXY_ADDRESS, WETH_ADDRESS, EXCHANGE_V2_ADDRESS } from "../../../constant"
import { genSellAssets, genSellOrder, signOrder } from "../../../helper"
import { useChakraToast } from "../../../hooks"
import { Order } from "../../../types"
import useWalletContext from "../../../web3/useWalletContext"
import { getToken } from "../../../web3/utils"

const useCreateListing = (collectionId: string, tokenId: number, onClose: () => void) => {
    const [price, setPrice] = useState("0")
    const [currency, setCurrency] = useState("ETH")
    const wallet = useWalletContext()
    const qc = useQueryClient()
    const toast = useChakraToast()

    const [progress, setProgress] = useState("Approving")

    const createSellOrder = async () => {
        // make sure contract is approved to use user's nft
        const isApproved = await wallet.scCaller.current?.DynamicERC721.isApprovedForAll(
            collectionId,
            wallet.account as string,
            TRANSFER_PROXY_ADDRESS
        )
        if (!isApproved) {
            await wallet.scCaller.current?.DynamicERC721.setApprovalForAll(collectionId, TRANSFER_PROXY_ADDRESS)
        } else setProgress("Signing")

        const assets = genSellAssets({
            price: ethers.utils.parseEther(price).toString(),
            tokenAddress: collectionId,
            tokenId,
            tokenType: "ERC721",
            amount: 1,
            buyTokenContract: currency === "WETH" ? WETH_ADDRESS : undefined,
        })

        const sellOrder = genSellOrder(wallet.account as string, assets.makeAsset, assets.takeAsset)

        const encodedData = await getEncodeDataToSignAPI(sellOrder)

        const signature = await signOrder(
            wallet.ethereum,
            wallet.account as string,
            { chainId: 4, exchange: EXCHANGE_V2_ADDRESS },
            encodedData
        )
        sellOrder.signature = signature
        setProgress("Creating")
        const token = getToken()
        if (!token) return

        await createListing(sellOrder, token)
    }

    const { mutate: mutateCreateListing, isLoading: isCreatingListing } = useMutation(() => createSellOrder(), {
        onSuccess: () => {
            qc.invalidateQueries("listing")
            toast({
                status: "success",
                title: "Create listing successfully!",
            })
            onClose()
        },
        onError: (e: any) => {
            console.log(e)
            toast({
                status: "error",
                title: e.message || "Create listing failed!",
            })
        },
    })

    // const updateSellOrder = async (oldOrder: Order, newPrice: string) => {
    //     const priceInBN = ethers.utils.parseEther(newPrice)
    //     if (priceInBN.gte(oldOrder.takeAsset.value)) {
    //         toast({
    //             status: "error",
    //             title: "Price must be less than the current price",
    //         })
    //     }

    //     const assets = genSellAssets({
    //         price: priceInBN.toString(),
    //         tokenAddress: oldOrder.makeAsset.assetType.contract,
    //         tokenId: oldOrder.makeAsset.assetType.tokenId,
    //         tokenType: oldOrder.takeAsset.assetType.assetClass,
    //         amount: oldOrder.makeAsset.value as number,
    //         buyTokenContract: oldOrder.takeAsset.assetType.contract,
    //     })

    //     const sellOrder = genSellOrder(wallet.account as string, assets.makeAsset, assets.takeAsset, oldOrder.salt)

    //     const encodedData = await getEncodeDataToSignAPI(sellOrder)

    //     const signature = await signOrder(
    //         wallet.ethereum,
    //         wallet.account as string,
    //         { chainId: 4, exchange: EXCHANGE_V2_ADDRESS },
    //         encodedData
    //     )
    //     sellOrder.signature = signature
    //     sellOrder.hash = oldOrder.hash

    //     const token = getToken()
    //     if (!token) return

    //     await createListing(sellOrder, token)
    // }

    // const { mutate: mutateUpdateListing, isLoading: isUpdatingListing } = useMutation<
    //     unknown,
    //     unknown,
    //     { oldOrder: Order; newPrice: string }
    // >(input => updateSellOrder(input.oldOrder, input.newPrice), {
    //     onSuccess: () => {
    //         qc.invalidateQueries("listing")
    //         toast({
    //             status: "success",
    //             title: "Update listing successfully!",
    //         })
    //         onClose()
    //     },

    // })

    return {
        currency,
        setCurrency,
        price,
        setPrice,
        mutateCreateListing,
        isCreatingListing,
        // mutateUpdateListing,
        // isUpdatingListing,
        progress,
    }
}

export default useCreateListing

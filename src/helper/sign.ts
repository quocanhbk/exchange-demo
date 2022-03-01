import { Address, keccak256 } from "ethereumjs-util"
import {
    CONTRACT_TOKEN_ID,
    DATA_V2_TYPE,
    EIP712_DOMAIN_TEMPLATE,
    EIP712_ORDER_TYPE,
    EIP712_ORDER_TYPES,
    ZERO_ADDRESS,
} from "../constant"
import { Asset, AssetType, Order } from "../types"
import Web3 from "web3"
type Binary = string & {
    __IS_BINARY__: true
}

function toBinary(value: string): Binary {
    let hex: string
    if (value.startsWith("0x")) {
        hex = value.substring(2).toLowerCase()
    } else {
        hex = value.toLowerCase()
    }
    const re = /[0-9a-f]*/g
    if (re.test(hex)) {
        return `0x${hex}` as Binary
    }
    throw new Error(`not a binary: ${value}`)
}

const signTypedDataV3 = async (ethereum: any, from: string, data: any) => {
    return await ethereum.request({
        method: "eth_signTypedData_v4",
        params: [from, JSON.stringify(data)],
    })
}

const createEIP712Domain = (chainId: number, verifyingContract: Address | string) => {
    return {
        ...EIP712_DOMAIN_TEMPLATE,
        verifyingContract: verifyingContract,
        chainId,
    }
}

export const signOrder = async (
    ethereum: any,
    signer: string,
    config: { chainId: number; exchange: string },
    orderStruct: any
): Promise<any> => {
    const domain = createEIP712Domain(config.chainId, config.exchange)
    const signature = await signTypedDataV3(ethereum, signer, {
        primaryType: EIP712_ORDER_TYPE,
        domain,
        types: EIP712_ORDER_TYPES,
        message: orderStruct,
    })
    return toBinary(signature)
}

export const id = (value: string) => {
    return `0x${keccak256(Buffer.from(value)).toString("hex")}`.substring(0, 10)
}

const assetTypeToStruct = (assetType: AssetType) => {
    const abiCoder = new Web3().eth.abi

    if (assetType.assetClass === "ETH")
        return {
            assetClass: id("ETH"),
            data: "0x",
        }
    if (assetType.assetClass === "ERC20")
        return {
            assetClass: id("ERC20"),
            data: abiCoder.encodeParameter("address", assetType.contract),
        }
    return {
        assetClass: id(assetType.assetClass),
        data: abiCoder.encodeParameter(
            { root: CONTRACT_TOKEN_ID },
            { contract: assetType.contract, tokenId: assetType.tokenId }
        ),
    }
}

const assetToStruct = (asset: Asset) => {
    return {
        assetType: assetTypeToStruct(asset.assetType),
        value: asset.value,
    }
}

const encodeData = (orderData: any) => {
    const abiCoder = new Web3().eth.abi

    const encoded = abiCoder.encodeParameter(DATA_V2_TYPE, {
        payouts: orderData.payouts,
        originFees: orderData.originFees,
        isMakeFill: orderData.isMakeFill,
    })

    return ["0x23d235ef", encoded]
}

export const orderToStruct = (order: Order): any => {
    const [dataType, data] = encodeData(order.data)
    return {
        maker: order.maker,
        makeAsset: assetToStruct(order.makeAsset),
        taker: order.taker ?? ZERO_ADDRESS,
        takeAsset: assetToStruct(order.takeAsset),
        salt: order.salt,
        start: order.start ?? 0,
        end: order.end ?? 0,
        dataType,
        data,
    }
}

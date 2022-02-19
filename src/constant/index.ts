export * from "./abi"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const DATA_V2_TYPE = {
    components: [
        {
            components: [
                {
                    name: "account",
                    type: "address",
                },
                {
                    name: "value",
                    type: "uint96",
                },
            ],
            name: "payouts",
            type: "tuple[]",
        },
        {
            components: [
                {
                    name: "account",
                    type: "address",
                },
                {
                    name: "value",
                    type: "uint96",
                },
            ],
            name: "originFees",
            type: "tuple[]",
        },
        {
            name: "isMakeFill",
            type: "bool",
        },
    ],
    name: "data",
    type: "tuple",
}

export const ERC721_LAZY_TYPE = {
    components: [
        {
            name: "contract",
            type: "address",
        },
        {
            components: [
                {
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    name: "uri",
                    type: "string",
                },
                {
                    components: [
                        {
                            name: "account",
                            type: "address",
                        },
                        {
                            name: "value",
                            type: "uint96",
                        },
                    ],
                    name: "creators",
                    type: "tuple[]",
                },
                {
                    components: [
                        {
                            name: "account",
                            type: "address",
                        },
                        {
                            name: "value",
                            type: "uint96",
                        },
                    ],
                    name: "royalties",
                    type: "tuple[]",
                },
                {
                    name: "signatures",
                    type: "bytes[]",
                },
            ],
            name: "data",
            type: "tuple",
        },
    ],
    name: "data",
    type: "tuple",
}

export const ERC1155_LAZY_TYPE = {
    components: [
        {
            name: "contract",
            type: "address",
        },
        {
            components: [
                {
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    name: "uri",
                    type: "string",
                },
                {
                    name: "supply",
                    type: "uint256",
                },
                {
                    components: [
                        {
                            name: "account",
                            type: "address",
                        },
                        {
                            name: "value",
                            type: "uint96",
                        },
                    ],
                    name: "creators",
                    type: "tuple[]",
                },
                {
                    components: [
                        {
                            name: "account",
                            type: "address",
                        },
                        {
                            name: "value",
                            type: "uint96",
                        },
                    ],
                    name: "royalties",
                    type: "tuple[]",
                },
                {
                    name: "signatures",
                    type: "bytes[]",
                },
            ],
            name: "data",
            type: "tuple",
        },
    ],
    name: "data",
    type: "tuple",
}

export const CONTRACT_TOKEN_ID = {
    contract: "address",
    tokenId: "uint256",
}

export const EXCHANGE_V2_ADDRESS = "0x21E77f475E8B4eA1500A083905CD642044C4eF7A"

export const TRANSFER_PROXY_ADDRESS =
    "0xC399b4C40AaE47bb17f3C5e03F5CEc337C365C8a"

export const WETH_ADDRESS = "0xc778417E063141139Fce010982780140Aa0cD5Ab" // WETH

export const TRANSFER_ERC20_PROXY_ADDRESS =
    "0x5acFbF9681fD5e9A32E74EFB7Fd0CA794138aBe6"

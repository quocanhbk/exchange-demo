export * from "./abi"
export * from "./eip712"

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

export const EXCHANGE_V2_ADDRESS = "0xBD7809C0F8122ef1798DD92C6c2A8D4dc8DCF6d7"

export const TRANSFER_PROXY_ADDRESS = "0x6240942cc4BBA91069FC595CEcF95f7458dc00C9"

export const WETH_ADDRESS = "0xc778417E063141139Fce010982780140Aa0cD5Ab" // WETH

export const TRANSFER_ERC20_PROXY_ADDRESS = "0xF15502fccCfBf295e8B1b7b8919CD351646088B3"

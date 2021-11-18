export const address = "0x1E9c6B395DA8031E19D6Af8c5C2F5D268d339127"
export const abi: any = [
    {
        inputs: [
            {
                internalType: "string",
                name: "_greeting",
                type: "string",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "greet",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_greeting",
                type: "string",
            },
        ],
        name: "setGreeting",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
]

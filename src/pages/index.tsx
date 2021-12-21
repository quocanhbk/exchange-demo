import { Box, Button, Text, VStack, Heading, Input } from "@chakra-ui/react"
import type { NextPage } from "next"
import { useState } from "react"
import Web3 from "web3"
import OldWeb3 from "oldWeb3"
import { ethers } from "ethers"
import { abi, address } from "../web3/smartContract"
import useWalletContext from "../web3/useWalletContext"
import { useQuery, useMutation, useQueryClient } from "react-query"
const Home: NextPage = () => {
    const wallet = useWalletContext()
    const [name, setName] = useState("")

    const qc = useQueryClient()

    const setGreeting = async () => {
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        const greetingContract = new ethers.Contract(address, abi, provider)
        await greetingContract.connect(provider.getSigner()).setGreeting(name)
    }

    const getGreeting = async (): Promise<string> => {
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        const greetingContract = new ethers.Contract(address, abi, provider)
        let greeting = await greetingContract.greet()
        return greeting
    }

    const { data } = useQuery("greet", getGreeting, {
        enabled: !!wallet.ethereum,
        onSuccess: () => {
            qc.invalidateQueries("greet")
        },
    })

    const { mutate, isLoading } = useMutation(() => setGreeting())

    return (
        <Box h="full" p={8}>
            <VStack>
                <Heading fontSize="xl" mb={4}>
                    Supported chain: Rinkeby
                </Heading>
                <Heading fontSize="xl" mb={4}>
                    Connector: {wallet.connector}
                </Heading>
                {wallet.isActive && (
                    <Box>
                        <Text fontWeight="semibold">Status</Text>
                        <Text color="red.500">{wallet.isActive ? "Active" : "Inactive"}</Text>
                        <Text fontWeight="semibold">Account</Text>
                        <Text color="red.500">{wallet.account}</Text>
                        <Text fontWeight="semibold">Connector</Text>
                        <Text color="red.500">{wallet.connector}</Text>
                    </Box>
                )}
                {wallet.error && (
                    <Box>
                        <Text fontWeight="semibold">Error</Text>
                        <Text color="red.500">{wallet.error?.message}</Text>
                    </Box>
                )}
                {!wallet.isActive ? (
                    <>
                        {" "}
                        <Button colorScheme="teal" w="20rem" onClick={() => wallet.connect()}>
                            Connect Metamask
                        </Button>
                        <Button colorScheme="blue" w="20rem" onClick={() => wallet.connect("walletConnect")}>
                            Connect WalletConnect
                        </Button>
                        <Button colorScheme="green" w="20rem" onClick={() => wallet.connect("trezor")}>
                            Connect Trezor
                        </Button>
                        <Button colorScheme="yellow" w="20rem" onClick={() => wallet.connect("gnosis")}>
                            Connect Gnosis
                        </Button>
                    </>
                ) : (
                    <>
                        <Text>Current greeting: {data}</Text>
                        <Input value={name} onChange={e => setName(e.target.value)} w="20rem" />
                        <Button colorScheme="yellow" w="20rem" onClick={() => mutate()} isLoading={isLoading}>
                            Set Greeting
                        </Button>
                        <Button colorScheme="red" w="20rem" onClick={() => wallet.reset()}>
                            Reset
                        </Button>
                    </>
                )}
            </VStack>
        </Box>
    )
}

export default Home

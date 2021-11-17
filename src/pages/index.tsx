import { Box, Button, Text, VStack, Heading } from "@chakra-ui/react"
import type { NextPage } from "next"
import useWalletContext from "../web3/useWalletContext"

const Home: NextPage = () => {
    const wallet = useWalletContext()
    return (
        <Box h="full" p={8}>
            <VStack>
                <Heading fontSize="xl" mb={4}>
                    Supported chain: Mainnet
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
                <Button colorScheme="teal" w="20rem" onClick={() => wallet.connect()}>
                    Connect Metamask
                </Button>
                <Button colorScheme="blue" w="20rem" onClick={() => wallet.connect("walletConnect")}>
                    Connect WalletConnect
                </Button>
                <Button colorScheme="green" w="20rem" onClick={() => wallet.connect("trezor")}>
                    Connect Trezor
                </Button>
                <Button colorScheme="red" w="20rem" onClick={() => wallet.reset()}>
                    Reset
                </Button>
            </VStack>
        </Box>
    )
}

export default Home

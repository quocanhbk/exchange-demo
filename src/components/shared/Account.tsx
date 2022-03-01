import { Button, Box, Text, Flex } from "@chakra-ui/react"
import { useQuery } from "react-query"
import { getMe, loadMessageLogin, loginWithSignature } from "../../api"
import { weiToEther } from "../../contracts"
import { useEthBalance, useWethBalance } from "../../hooks"
import useWalletContext from "../../web3/useWalletContext"

export const Account = () => {
    const wallet = useWalletContext()

    const ethBalance = useEthBalance()

    const wethBalance = useWethBalance()

    if (!wallet.isActive)
        return (
            <Button colorScheme="teal" w="20rem" onClick={() => wallet.connect()}>
                Connect Metamask
            </Button>
        )

    if (wallet.error)
        return (
            <Box>
                <Text fontWeight="semibold">Error</Text>
                <Text color="red.500">{wallet.error?.message}</Text>
            </Box>
        )

    return (
        <Box>
            <Flex align="center">
                <Text fontWeight="semibold" w="5rem">
                    Account
                </Text>
                <Text color={wallet.token ? "teal.500" : "red.500"} ml={2}>
                    {wallet.account}
                </Text>
                {!wallet.token && (
                    <Button size="sm" colorScheme="teal">
                        Sign Message
                    </Button>
                )}
            </Flex>
            <Flex>
                <Text fontWeight={"semibold"} w="5rem">
                    ETH
                </Text>
                <Text color="yellow.500" ml={2}>
                    {weiToEther(ethBalance)}
                </Text>
            </Flex>
            <Flex>
                <Text fontWeight={"semibold"} w="5rem">
                    WETH
                </Text>
                <Text color="pink.500" ml={2}>
                    {weiToEther(wethBalance)}
                </Text>
            </Flex>
        </Box>
    )
}

export default Account

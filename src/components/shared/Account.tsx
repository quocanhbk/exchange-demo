import { Button, Box, Text, Flex } from "@chakra-ui/react"
import { useQuery } from "react-query"
import { getMe, loadMessageLogin, loginWithSignature } from "../../api"
import useWalletContext from "../../web3/useWalletContext"

export const Account = () => {
    const wallet = useWalletContext()

    const { data: ethBalance } = useQuery(
        "eth-balance",
        () => wallet.scCaller.current?.getEtherBalance(wallet.account!),
        {
            enabled: !!wallet.scCaller.current && !!wallet.account,
        }
    )

    const { data: wethBalance } = useQuery(
        "weth-balance",
        () => wallet.scCaller.current?.Weth.getBalance(wallet.account!),
        {
            enabled: !!wallet.scCaller.current && !!wallet.account,
        }
    )

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
                <Text color="teal.500" ml={2}>
                    {wallet.account}
                </Text>
            </Flex>
            <Flex>
                <Text fontWeight={"semibold"} w="5rem">
                    ETH
                </Text>
                <Text color="yellow.500" ml={2}>
                    {ethBalance}
                </Text>
            </Flex>
            <Flex>
                <Text fontWeight={"semibold"} w="5rem">
                    WETH
                </Text>
                <Text color="red.500" ml={2}>
                    {wethBalance}
                </Text>
            </Flex>
        </Box>
    )
}

export default Account

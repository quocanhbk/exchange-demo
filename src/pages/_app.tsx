import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Web3ReactProvider } from "@web3-react/core"
import { ChakraProvider, Box, Heading } from "@chakra-ui/react"
import UseWalletProvider from "../web3/Provider"
import { QueryClient, QueryClientProvider } from "react-query"
import SafeProvider from "../components/SafeProvider"
import { Account } from "../components/shared"
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SafeProvider>
                <Web3ReactProvider getLibrary={ethereum => ethereum}>
                    <UseWalletProvider>
                        <ChakraProvider>
                            <Box bg="gray.900" color="whiteAlpha.900" minH="100vh" p={8}>
                                <Box mb={4}>
                                    <Heading mb={4}>Supported chain: Rinkeby</Heading>
                                    <Box borderBottom={"1px"} borderColor="whiteAlpha.200" pb={4}>
                                        <Account />
                                    </Box>
                                </Box>
                                <Component {...pageProps} />
                            </Box>
                        </ChakraProvider>
                    </UseWalletProvider>
                </Web3ReactProvider>
            </SafeProvider>
        </QueryClientProvider>
    )
}

export default MyApp

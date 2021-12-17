import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Web3ReactProvider } from "@web3-react/core"
import { ChakraProvider, Box } from "@chakra-ui/react"
import UseWalletProvider from "../web3/Provider"
import { QueryClient, QueryClientProvider } from "react-query"
import SafeProvider from "../components/SafeProvider"
import Head from "next/head"
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SafeProvider>
                <Web3ReactProvider getLibrary={ethereum => ethereum}>
                    <UseWalletProvider>
                        <ChakraProvider>
                            <Head>
                                <link rel="manifest" href="/manifest.json" />
                            </Head>
                            <Box h="100vh" bg="gray.900" color="whiteAlpha.900">
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

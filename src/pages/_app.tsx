import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Web3ReactProvider } from "@web3-react/core"
import { ChakraProvider, Box } from "@chakra-ui/react"
import UseWalletProvider from "../web3/Provider"
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Web3ReactProvider getLibrary={ethereum => ethereum}>
            <UseWalletProvider>
                <ChakraProvider>
                    <Box h="100vh" bg="gray.900" color="whiteAlpha.900">
                        <Component {...pageProps} />
                    </Box>
                </ChakraProvider>
            </UseWalletProvider>
        </Web3ReactProvider>
    )
}

export default MyApp

import { ReactNode } from "react"
import WalletContext from "./WalletContext"
import useWallet from "./useWallet"

interface UseWalletProviderProps {
    children: ReactNode
}

const UseWalletProvider = ({ children }: UseWalletProviderProps) => {
    const wallet = useWallet()

    return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
}

export default UseWalletProvider

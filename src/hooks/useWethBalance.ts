import { useQuery } from "react-query"
import useWalletContext from "../web3/useWalletContext"

export const useWethBalance = () => {
    const wallet = useWalletContext()

    const { data: wethBalance } = useQuery(
        "weth-balance",
        () => wallet.scCaller.current?.Weth.getBalance(wallet.account!),
        {
            enabled: !!wallet.scCaller.current && !!wallet.account,
            initialData: 0,
        }
    )

    return wethBalance as number
}

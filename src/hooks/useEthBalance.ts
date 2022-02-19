import { useQuery } from "react-query"
import useWalletContext from "../web3/useWalletContext"

export const useEthBalance = () => {
    const wallet = useWalletContext()

    const { data: ethBalance } = useQuery(
        "eth-balance",
        () => wallet.scCaller.current?.getEtherBalance(wallet.account!),
        {
            enabled: !!wallet.scCaller.current && !!wallet.account,
            initialData: 0,
        }
    )

    return ethBalance as number
}

import { BigNumber } from "ethers"
import { useQuery } from "react-query"
import useWalletContext from "../web3/useWalletContext"

export const useEthBalance = () => {
    const wallet = useWalletContext()

    const { data: ethBalance } = useQuery(
        ["eth-balance", wallet.account],
        () => wallet.scCaller.current?.getEtherBalance(wallet.account!),
        {
            enabled: !!wallet.scCaller.current && !!wallet.account,
            initialData: BigNumber.from(0),
        }
    )

    return ethBalance as BigNumber
}

import { BigNumber } from "ethers"
import { useQuery } from "react-query"
import useWalletContext from "../web3/useWalletContext"

export const useWethBalance = () => {
    const wallet = useWalletContext()

    const { data: wethBalance } = useQuery(
        ["weth-balance", wallet.account],
        () => wallet.scCaller.current?.Weth.getBalance(wallet.account!),
        {
            enabled: !!wallet.scCaller.current && !!wallet.account,
            initialData: BigNumber.from(0),
        }
    )

    return wethBalance as BigNumber
}

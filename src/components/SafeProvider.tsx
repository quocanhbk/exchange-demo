// mai sua cho nay nha
import { createContext, useState, useEffect, useContext, useMemo, ReactElement } from "react"
import SafeAppsSDK, { Opts as SDKOpts, SafeInfo } from "@gnosis.pm/safe-apps-sdk"

type SafeReactSDKContext = {
    sdk: SafeAppsSDK | null
    connected: boolean
    safe: SafeInfo
}

const SafeContext = createContext<SafeReactSDKContext | undefined>(undefined)

interface Props {
    loader?: ReactElement
    opts?: SDKOpts
}

export const SafeProvider: React.FC<Props> = ({ loader = null, opts, children }) => {
    const [sdk, setSdk] = useState<SafeAppsSDK | null>(null)
    const [connected, setConnected] = useState(false)
    const [safe, setSafe] = useState<SafeInfo>({ safeAddress: "", chainId: 1, threshold: 1, owners: [] })
    const contextValue = useMemo(() => ({ sdk, connected, safe }), [sdk, connected, safe])

    useEffect(() => {
        setSdk(() => new SafeAppsSDK(opts))
        console.log("Safe Provider")
    }, [opts])

    useEffect(() => {
        console.log("Fetch")
        let active = true
        if (sdk) {
            const fetchSafeInfo = async () => {
                try {
                    const safeInfo = await sdk.safe.getInfo()

                    if (!active) {
                        return
                    }
                    setSafe(safeInfo)
                    setConnected(true)
                } catch (err) {
                    if (!active) {
                        return
                    }
                    setConnected(false)
                }
            }

            fetchSafeInfo()
        }

        return () => {
            active = false
        }
    }, [sdk])

    if (!connected && loader) {
        return loader
    }

    return <SafeContext.Provider value={contextValue}>{children}</SafeContext.Provider>
}

export const useSafeAppsSDK = (): SafeReactSDKContext => {
    const value = useContext(SafeContext)

    if (value === undefined) {
        throw new Error("You probably forgot to put <SafeProvider>.")
    }

    return value
}

export default SafeProvider

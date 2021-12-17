import React from "react"
import { useWeb3React } from "@web3-react/core"
import { SafeAppConnector } from "@gnosis.pm/safe-apps-web3-react"

function useSafeAppConnection(connector: SafeAppConnector | undefined): boolean {
    const { activate, active } = useWeb3React()
    const [tried, setTried] = React.useState(false)

    React.useEffect(() => {
        if (connector) {
            connector.isSafeApp().then(loadedInSafe => {
                if (loadedInSafe) {
                    // On success active flag will change and in that case we'll set tried to true, check the hook below
                    activate(connector, undefined, true).catch(() => {
                        setTried(true)
                    })
                } else {
                    setTried(true)
                }
            })
        }
    }, [activate, connector]) // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    React.useEffect(() => {
        if (active) {
            setTried(true)
        }
    }, [active])

    return tried
}

export { useSafeAppConnection }

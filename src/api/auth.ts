import { getToken } from "../web3/utils"
import fetcher from "./fetcher"

export const loadMessageLogin = async (wallet: string) => {
    const { data } = await fetcher.get(`/auth/message?wallet=${wallet}`)
    return data
}

export const loginWithSignature = async (wallet: string, time: string, signature: string) => {
    const { data } = await fetcher.post(`/auth/login/`, {
        wallet,
        time,
        signature,
    })
    return data.token
}

export const getMe = async () => {
    try {
        const { data } = await fetcher.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
        return data
    } catch (e) {
        return null
    }
}

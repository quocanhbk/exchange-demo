export * from "./order"
export * from "./sign"

export const rejectTimeout = (timeout = 30000) =>
    new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error("Contract timeout!")), timeout)
    })

export const race = (promise: () => Promise<void>): Promise<void> => {
    return Promise.race([promise(), rejectTimeout()])
}

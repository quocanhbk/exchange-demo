import axios from "axios"
const baseURL = "https://dev-api-marketplace.sipher.gg/api"

const fetcher = axios.create({ baseURL, withCredentials: true })

export default fetcher

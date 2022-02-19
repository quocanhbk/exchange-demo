import { useRouter } from "next/dist/client/router"
import DetailUI from "../components/ui/detail"

const DetailPage = () => {
    const router = useRouter()
    const { id } = router.query

    return <DetailUI id={id} />
}

export default DetailPage

import {
    Button,
    Box,
    VStack,
    Heading,
    Text,
    Wrap,
    WrapItem,
    Flex,
    HStack,
    ButtonGroup,
    Checkbox,
    Input,
} from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useState } from "react"
import { useQuery } from "react-query"
import { getNftItems } from "../../../api"
import useWalletContext from "../../../web3/useWalletContext"
import NftCard from "./NftCard"

const HomeUI = () => {
    const router = useRouter()
    const { account } = useWalletContext()

    const { data: inuItems } = useQuery(
        ["nft-items", "0x4d91fa57abfead5fbc8445e45b906b85bbd9744c"],
        () => getNftItems("0x4d91fa57abfead5fbc8445e45b906b85bbd9744c"),
        {
            initialData: [],
        }
    )
    const { data: nekoItems } = useQuery(
        ["nft-items", "0x97c8480d593b93ae90f8613a5b2ac02e7a3dd0ed"],
        () => getNftItems("0x97c8480d593b93ae90f8613a5b2ac02e7a3dd0ed"),
        {
            initialData: [],
        }
    )

    const [collection, setCollection] = useState("inu")

    const [onlyMine, setOnlyMine] = useState(false)

    const [search, setSearch] = useState("")

    return (
        <Box>
            <Flex align="center" mb={4}>
                <Heading>Listing</Heading>
                <ButtonGroup isAttached ml={8}>
                    <Button
                        colorScheme={"yellow"}
                        variant={collection === "inu" ? "solid" : "outline"}
                        onClick={() => setCollection("inu")}
                        size="sm"
                        w="6rem"
                    >
                        Inu
                    </Button>
                    <Button
                        colorScheme={"yellow"}
                        variant={collection === "neko" ? "solid" : "outline"}
                        onClick={() => setCollection("neko")}
                        size="sm"
                        w="6rem"
                    >
                        Neko
                    </Button>
                </ButtonGroup>
                <Checkbox ml={8} isChecked={onlyMine} onChange={e => setOnlyMine(e.target.checked)} size="lg">
                    Only see mine
                </Checkbox>
                <Text ml="auto">{(collection === "inu" ? inuItems : nekoItems).length} NFT</Text>
            </Flex>
            <Input
                placeholder="Search"
                mb={4}
                variant="outline"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <Wrap spacing={4}>
                {(collection === "inu" ? inuItems : nekoItems)
                    .filter(item => !onlyMine || item.owner === account?.toLowerCase())
                    .filter(
                        item =>
                            !search ||
                            item.name?.toLowerCase().includes(search.toLowerCase()) ||
                            item.id?.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((item: any) => (
                        <WrapItem key={item.id}>
                            <NftCard data={item} onClick={() => router.push(`/${item.id}`)} />
                        </WrapItem>
                    ))}
            </Wrap>
        </Box>
    )
}

export default HomeUI

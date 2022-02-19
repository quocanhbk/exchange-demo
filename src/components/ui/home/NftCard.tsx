import { Box, Flex, Img, Text } from "@chakra-ui/react"
import useWalletContext from "../../../web3/useWalletContext"

const NftCard = ({ data, onClick = () => {} }) => {
    const { account } = useWalletContext()

    return (
        <Flex
            cursor="pointer"
            w="20rem"
            overflow="hidden"
            rounded="md"
            background={
                data.owner === account?.toLowerCase()
                    ? "green.500"
                    : "whiteAlpha.50"
            }
            onClick={onClick}
        >
            <Img src={data.imageUrl} boxSize="4rem" />
            <Box px={4} flex={1} overflow="hidden">
                <Text fontSize={"lg"} fontWeight="bold">
                    {data.name}
                </Text>
                <Text
                    fontSize={"sm"}
                    color="whiteAlpha.700"
                    isTruncated
                    w="full"
                >
                    {data.owner}
                </Text>
            </Box>
        </Flex>
    )
}

export default NftCard

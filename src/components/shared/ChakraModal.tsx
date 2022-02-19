import {
    Flex,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    ModalProps,
} from "@chakra-ui/react"

interface ChakraModalProps extends ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export const ChakraModal = ({
    isOpen,
    onClose,
    title,
    children,
    size = "xl",
    ...props
}: ChakraModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={size} {...props}>
            <ModalOverlay />
            <ModalContent overflow={"hidden"}>
                <Flex
                    px={6}
                    pt={4}
                    w="full"
                    justify="space-between"
                    align="center"
                    mb={2}
                >
                    <Heading fontSize={"xl"}>{title}</Heading>
                    <ModalCloseButton />
                </Flex>
                <ModalBody py={4}>{children}</ModalBody>
            </ModalContent>
        </Modal>
    )
}

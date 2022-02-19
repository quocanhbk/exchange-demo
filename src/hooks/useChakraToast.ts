import { useToast, UseToastOptions } from "@chakra-ui/react"

export const useChakraToast = () => {
    const toast = useToast()

    return (options: Pick<UseToastOptions, "title" | "description" | "status">) =>
        toast({
            ...options,
            position: "bottom",
            duration: 2500,
            isClosable: true,
            variant: "subtle",
        })
}

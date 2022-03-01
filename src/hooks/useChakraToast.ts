import { useToast, UseToastOptions } from "@chakra-ui/react"

export const useChakraToast = () => {
    const toast = useToast()

    return (options: Pick<UseToastOptions, "title" | "description" | "status" | "duration">) =>
        toast({
            ...options,
            position: "bottom",
            duration: options.duration || 5000,
            isClosable: true,
            variant: "subtle",
        })
}

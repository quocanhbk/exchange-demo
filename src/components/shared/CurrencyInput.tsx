import { NumberInput, NumberInputField, Text } from "@chakra-ui/react"
import { KeyboardEvent } from "react"

interface EtherInputProps {
    value: string
    setValue: (newValue: string) => void
    maxValue: number
}

export const CurrencyInput = ({ value, setValue, maxValue }: EtherInputProps) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === ",") {
            setValue(value + ".")
        }
    }

    return (
        <NumberInput
            flex={1}
            onChange={newValue => setValue(newValue)}
            onKeyDown={handleKeyDown}
            value={value}
            max={maxValue}
            min={0}
            w="full"
            mb={2}
        >
            <NumberInputField />
        </NumberInput>
    )
}

export default CurrencyInput

import { Stack, NumberInput } from '@mantine/core'

export function InterestRateGuess() {
  return (
    <Stack
      style={{ height: '75%' }}
      bg="var(--mantine-color-body)"
      align="center"
      justify="center"
      gap="sm"
    >
      <NumberInput decimalScale={3} fixedDecimalScale />
      <NumberInput decimalScale={3} fixedDecimalScale />
      <NumberInput decimalScale={3} fixedDecimalScale />
      <NumberInput decimalScale={3} fixedDecimalScale />
      <NumberInput decimalScale={3} fixedDecimalScale />
      <NumberInput decimalScale={3} fixedDecimalScale />
    </Stack>
  )
}

import { Stack, NumberInput } from '@mantine/core'

export function InterestRateGuess() {
  return (
    <Stack
      bg="var(--mantine-color-body)"
      align="center"
      justify="center"
      gap="sm"
    >
      <NumberInput decimalScale={3} fixedDecimalScale defaultValue={1.123} />
      <NumberInput decimalScale={3} fixedDecimalScale defaultValue={1.123} />
      <NumberInput decimalScale={3} fixedDecimalScale defaultValue={1.123} />
    </Stack>
  )
}

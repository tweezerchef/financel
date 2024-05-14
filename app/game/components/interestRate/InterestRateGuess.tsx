'use client'

import { Stack, NumberInput, Button, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState, useEffect } from 'react'
import { GuessDisplay } from './components/GuessDisplay' // Ensure the path is correct

export function InterestRateGuess() {
  const [result, setResult] = useState<{
    number: ResponseNumbers
    direction: Direction
  } | null>(null)
  const [flip, setFlip] = useState(false)
  const form = useForm({
    initialValues: {
      guess: 0, // Initialize as number
    },
  })

  const handleSubmit = (values: { guess: number }) => {
    console.log('Submitted guess:', values.guess)
    // Simulate a server response or call an API
    setResult({ number: 2, direction: 'up' }) // Example server response
    setFlip(true) // Trigger the flip on submission
  }

  useEffect(() => {
    if (!form.values.guess) setFlip(false)
  }, [form.values.guess])

  return (
    <Stack
      style={{ height: '75%' }}
      bg="var(--mantine-color-body)"
      align="center"
      justify="center"
      gap="sm"
    >
      <GuessDisplay guess={form.values.guess} result={result} flip={flip} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group justify="center">
          <NumberInput
            decimalScale={2}
            fixedDecimalScale
            hideControls
            {...form.getInputProps('guess', {
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                form.setFieldValue('guess', Number(event.currentTarget.value)),
            })}
          />
          <Button type="submit" color="blue">
            Submit
          </Button>
        </Group>
      </form>
    </Stack>
  )
}

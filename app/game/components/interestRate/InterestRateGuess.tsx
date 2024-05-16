'use client'

import { NumberInput, Button, Group, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { GuessDisplay } from './components/GuessDisplay'
import classes from './ui/InterestRateGuess.module.css'

export function InterestRateGuess() {
  const [results, setResults] = useState<
    Array<{
      guess: number
      result: { number: ResponseNumbers; direction: Direction } | null
    } | null>
  >(new Array(6).fill(null))
  const [activeGuessIndex, setActiveGuessIndex] = useState(0)
  const form = useForm({
    initialValues: {
      guess: 0, // Initialize as number
    },
  })

  const handleSubmit = async (values: { guess: number }) => {
    try {
      const result = fetch('/interestRate/api', {
        method: 'POST',
        body: JSON.stringify(values.guess),
      })
      console.log('Submitted guess:', values.guess)
      // Simulate a server response or call an API
      const newResults = [...results]
      newResults[activeGuessIndex] = {
        guess: values.guess,
        result,
      } // Example server response
      setResults(newResults)

      // Move to the next guess
      if (activeGuessIndex < 5) setActiveGuessIndex(activeGuessIndex + 1)

      form.reset()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }
  // create a function that creates a random id
  const createRandomId = () => {
    return Math.random().toString(36).substring(7)
  }

  return (
    <div className={classes.stack}>
      <div className={classes.guessDisplayBox}>
        {results.map((result, index) => (
          <div
            key={createRandomId()} // Using index for simplicity here; make sure data has a stable unique ID in a real app.
            className={classes.guessDisplay}
            style={{ display: index <= activeGuessIndex ? 'block' : 'none' }}
          >
            <GuessDisplay
              guess={result ? result.guess : 0} // Pass the stored guess value
              result={result ? result.result : null} // Pass the stored result
              flip={Boolean(result)}
            />
          </div>
        ))}
      </div>
      <div className={classes.guessBox}>
        {activeGuessIndex < 6 && (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Group gap="xs">
              <NumberInput
                decimalScale={2}
                fixedDecimalScale
                hideControls
                {...form.getInputProps('guess')}
              />
              <Button type="submit" color="blue">
                Submit
              </Button>
            </Group>
          </form>
        )}
        {activeGuessIndex >= 6 && <Text>All guesses submitted!</Text>}
      </div>
    </div>
  )
}

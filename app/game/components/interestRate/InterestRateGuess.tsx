/* eslint-disable react/no-array-index-key */
/* eslint-disable no-case-declarations */

'use client'

import { NumberInput, Button, Group, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useReducer, useCallback } from 'react'
import { GuessDisplay } from './components/GuessDisplay'
import classes from './ui/InterestRateGuess.module.css'

interface GuessState {
  results: Array<{
    guess: number
    result: { amount: ResponseNumbers; direction: Direction } | null
  } | null>
  activeGuessIndex: number
}

type GuessAction =
  | {
      type: 'ADD_GUESS'
      payload: {
        guess: number
        result: { amount: ResponseNumbers; direction: Direction } | null
      }
    }
  | { type: 'NEXT_GUESS' }

const initialState: GuessState = {
  results: new Array(6).fill(null),
  activeGuessIndex: 0,
}

function guessReducer(state: GuessState, action: GuessAction): GuessState {
  switch (action.type) {
    case 'ADD_GUESS':
      const newResults = [...state.results]
      newResults[state.activeGuessIndex] = {
        guess: action.payload.guess,
        result: action.payload.result,
      }
      return { ...state, results: newResults }
    case 'NEXT_GUESS':
      return { ...state, activeGuessIndex: state.activeGuessIndex + 1 }
    default:
      throw new Error('Unknown action type')
  }
}

export function InterestRateGuess() {
  const [state, dispatch] = useReducer(guessReducer, initialState)
  const form = useForm({
    initialValues: {
      guess: 0, // Initialize as number
    },
  })

  const handleSubmit = async (values: { guess: number }) => {
    try {
      const response = await fetch('/game/interestRate/api/', {
        method: 'POST',
        body: JSON.stringify({ guess: values.guess }),
      })
      const result = await response.json()
      console.log(result)
      // Dispatch the action to add the guess
      dispatch({
        type: 'ADD_GUESS',
        payload: {
          guess: values.guess,
          result: {
            amount: result.amount,
            direction: result.direction,
          },
        },
      })

      // Move to the next guess
      if (state.activeGuessIndex < 5) dispatch({ type: 'NEXT_GUESS' })

      form.reset()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // Memoized function to create a unique ID
  const createRandomId = useCallback(
    () => Math.random().toString(36).substring(7),
    []
  )

  return (
    <div className={classes.stack}>
      <div className={classes.guessDisplayBox}>
        {state.results.map((result, index) => (
          <div
            key={`guess-${index}`} // Using index for simplicity here; make sure data has a stable unique ID in a real app.
            className={classes.guessDisplay}
            style={{
              display: index <= state.activeGuessIndex ? 'block' : 'none',
            }}
          >
            <GuessDisplay
              guess={result ? result.guess : 0}
              result={result ? result.result : null}
              createRandomId={createRandomId}
            />
          </div>
        ))}
      </div>
      <div className={classes.guessBox}>
        {state.activeGuessIndex < 6 && (
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
        {state.activeGuessIndex >= 6 && <Text>All guesses submitted!</Text>}
      </div>
    </div>
  )
}

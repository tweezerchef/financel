/* eslint-disable react/no-array-index-key */

'use client'

import { UseFormReturnType } from '@mantine/form'
import { NumberInput } from '@mantine/core'
import classes from './ui/Keyboard.module.css'
import { Key } from './Key'

const keys = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 0],
  ['.', 'Backspace', 'Enter'],
]

interface KeyboardProps {
  form: UseFormReturnType<{ guess: string }>
  field: string
  handleSubmit: (values: { guess: string }) => void
}

export const Keyboard: React.FC<KeyboardProps> = ({
  form,
  field,
  handleSubmit,
}) => {
  const handleKeyPress = (value: string) => {
    let newValue = form.values.guess
    if (value === 'Enter') {
      form.validateField(field)
      if (form.isValid()) form.onSubmit((values) => handleSubmit(values))()
    } else if (value === 'Backspace') newValue = newValue.slice(0, -1) || '0'
    else newValue += value

    form.setFieldValue(field, newValue)
  }

  return (
    <div className={classes.container}>
      <NumberInput
        value={form.values.guess}
        onChange={(val) => form.setFieldValue(field, val || '0')}
        decimalScale={2}
        min={0.0}
        max={999.99}
        hideControls
      />
      <div className={classes.keyboard}>
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className={classes.row}>
            {row.map((key) => (
              <Key
                key={key}
                value={key.toString()}
                onClick={() => handleKeyPress(key.toString())}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

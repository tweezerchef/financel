/* eslint-disable react/no-array-index-key */

'use client'

import { UseFormReturnType } from '@mantine/form'
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
      if (!newValue.includes('.')) newValue += '.00'
      else if (newValue.split('.')[1].length === 1) newValue += '0'

      form.setFieldValue(field, newValue)
      form.validateField(field)
      if (form.isValid()) form.onSubmit((values) => handleSubmit(values))()
    } else if (value === 'Backspace') newValue = newValue.slice(0, -1) || '0'
    else if (newValue === '0') newValue = value
    else newValue += value

    form.setFieldValue(field, newValue)
  }

  return (
    <div className={classes.container}>
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

'use client'

import { v4 as uuidv4 } from 'uuid'
import { UseFormReturnType } from '@mantine/form'
import classes from './ui/Keyboard.module.css'
import { Key } from './Key'

const keys = [
  [1, 2, 3, 4, 5, '⌫'],
  [6, 7, 8, 9, 0, '↵'],
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
    if (value === '↵') {
      if (newValue.length === 3)
        form.onSubmit((values) => handleSubmit(values))()
    } else if (value === '⌫') newValue = newValue.slice(0, -1)
    else if (value !== '.') if (newValue.length < 3) newValue += value

    form.setFieldValue(field, newValue)
  }

  return (
    <div className={classes.keyboard}>
      {keys.map((row) => (
        <div key={uuidv4()} className={classes.row}>
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
  )
}

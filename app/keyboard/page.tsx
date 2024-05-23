/* eslint-disable react/no-array-index-key */

'use client'

import { useState } from 'react'
import classes from './components/ui/Keyboard.module.css'
import { Key } from './components/Key'

const keys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Enter', 'Backspace'],
]

export default function Keyboard() {
  const [input, setInput] = useState('')

  const onKeyPress = (value: string) => {
    if (value === 'Enter') console.log(input)
    else if (value === 'Backspace') setInput(input.slice(0, -1))
    else setInput(input + value)
  }
  return (
    <div className={classes.keyboard}>
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className={classes.row}>
          {row.map((key) => (
            <Key key={key} value={key} onClick={onKeyPress} />
          ))}
        </div>
      ))}
    </div>
  )
}

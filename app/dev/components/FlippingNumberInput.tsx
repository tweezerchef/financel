/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/label-has-associated-control */

'use client'

import React, { useState, useEffect } from 'react'
import styles from './ui/FlippingNumberInput.module.css'

export default function FlippingNumberInput() {
  const [number, setNumber] = useState('')
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (isFlipping) {
      const timer = setTimeout(() => setIsFlipping(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isFlipping])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value === '' || (Number(value) >= 0 && Number(value) <= 999)) {
      const wasEmpty = number === ''
      const becomesEmpty = value === ''
      setNumber(value)

      if (wasEmpty !== becomesEmpty) {
        setIsFlipping(true)
        setIsFlipped(!becomesEmpty)
      }
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.flipBox} ${isFlipping ? styles.flipping : ''} ${isFlipped ? styles.flipped : ''}`}
      >
        <div className={styles.flipBoxInner}>
          <div className={styles.flipBoxFront} />
          <div className={styles.flipBoxBack}>{number}</div>
        </div>
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="numberInput" className={styles.label}>
          Enter a number
        </label>
        <input
          id="numberInput"
          type="number"
          value={number}
          onChange={handleInputChange}
          min="0"
          max="999"
          placeholder="Enter a number (0-999)"
          className={styles.input}
        />
      </div>
    </div>
  )
}

/* eslint-disable consistent-return */

' use client '

// SingleDisplay.tsx

// SingleDisplay.tsx

// SingleDisplay.tsx

import React, { useState, useEffect } from 'react'
import styles from './ui/SingleDisplay.module.css'

interface SingleDisplayProps {
  value: string
}

export const SingleDisplay: React.FC<SingleDisplayProps> = ({ value }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setIsFlipped(value !== '')
  }, [value])

  return (
    <div className={styles.flipBox}>
      <div
        className={`${styles.flipBoxInner} ${isFlipped ? styles.flipped : ''}`}
      >
        <div className={styles.flipBoxFront} />
        <div className={styles.flipBoxBack}>{value}</div>
      </div>
    </div>
  )
}

/* eslint-disable consistent-return */

' use client '

import React, { useState, useEffect } from 'react'
import styles from './ui/SingleDisplay.module.css'

interface SingleDisplayProps {
  value: string
  isFlipped: boolean
}

export const SingleDisplay: React.FC<SingleDisplayProps> = ({
  value,
  isFlipped,
}) => {
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (isFlipped) {
      setIsFlipping(true)
      const timer = setTimeout(() => setIsFlipping(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isFlipped])

  return (
    <div className={styles.flipBox}>
      <div
        className={`${styles.flipBoxInner} ${isFlipping ? styles.flipping : ''} ${isFlipped ? styles.flipped : ''}`}
      >
        <div className={styles.flipBoxFront}>{value || '0'}</div>
        <div className={styles.flipBoxBack}>{value || '0'}</div>
      </div>
    </div>
  )
}

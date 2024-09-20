import React from 'react'
import styles from './ui/SingleDisplay.module.css'

interface SingleDisplayProps {
  value: string
  isFlipping: boolean
}

export const SingleDisplay: React.FC<SingleDisplayProps> = ({
  value,
  isFlipping,
}) => {
  return (
    <div className={styles.flipBox}>
      <div
        className={`${styles.flipBoxInner} ${isFlipping ? styles.flipping : ''} ${value !== '' ? styles.flipped : ''}`}
      >
        <div className={styles.flipBoxFront} />
        <div className={styles.flipBoxBack}>{value}</div>
      </div>
    </div>
  )
}

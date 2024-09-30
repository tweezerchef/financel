import React from 'react'
import styles from './ui/SingleDisplay.module.css'

interface SingleDisplayProps {
  value: string
  isSpinning: boolean
  spinDuration: number
}

export const SingleDisplay: React.FC<SingleDisplayProps> = ({
  value,
  isSpinning,
  spinDuration,
}) => {
  return (
    <div className={styles.flipBox}>
      <div
        className={`${styles.flipBoxInner} ${isSpinning ? styles.spinning : ''} ${value !== '' ? styles.flipped : ''}`}
        style={{
          animationDuration: isSpinning ? `${spinDuration}ms` : '300ms',
        }}
      >
        <div className={styles.flipBoxFront} />
        <div className={styles.flipBoxBack}>{value}</div>
      </div>
    </div>
  )
}

import { FC, useState, useEffect, useRef } from 'react'
import styles from './ui/SingleDisplay.module.css'

interface SingleDisplayProps {
  value: string
  isSpinning: boolean
}

export const SingleDisplay: FC<SingleDisplayProps> = ({
  value,
  isSpinning,
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isSpinning) {
      const flip = () => {
        setIsFlipped((prev) => !prev)
        intervalRef.current = setTimeout(flip, Math.random() * 200 + 50) // Random interval between 50ms and 250ms
      }
      flip()
    } else {
      if (intervalRef.current) clearTimeout(intervalRef.current)

      setIsFlipped(value !== '')
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current)
    }
  }, [isSpinning, value])

  return (
    <div className={styles.flipBox}>
      <div
        className={`${styles.flipBoxInner} ${isFlipped ? styles.flipped : ''}`}
        style={{
          transition: `transform ${isSpinning ? '0.1s' : '0.3s'}`,
        }}
      >
        <div className={styles.flipBoxFront} />
        <div className={styles.flipBoxBack}>{isSpinning ? '' : value}</div>
      </div>
    </div>
  )
}

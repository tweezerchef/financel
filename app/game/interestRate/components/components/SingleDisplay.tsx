/* eslint-disable no-nested-ternary */
import { FC, useState, useEffect, useRef } from 'react'
import styles from './ui/SingleDisplay.module.css'

interface SingleDisplayProps {
  value: string
  isSpinning: boolean
  isNumber: boolean
}

const randomNumber = () => Math.floor(Math.random() * 10).toString()
const randomArrow = () => (Math.random() < 0.5 ? '↑' : '↓')

export const SingleDisplay: FC<SingleDisplayProps> = ({
  value,
  isSpinning,
  isNumber,
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [frontContent, setFrontContent] = useState('')
  const [backContent, setBackContent] = useState('')
  const [isFrontTopHalf, setIsFrontTopHalf] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isSpinning) {
      const flip = () => {
        const newFrontContent = isNumber ? randomNumber() : randomArrow()
        const newBackContent = isNumber ? randomNumber() : randomArrow()
        setFrontContent(newFrontContent)
        setBackContent(newBackContent)
        setIsFrontTopHalf(Math.random() < 0.5)
        setIsFlipped((prev) => !prev)
        intervalRef.current = setTimeout(flip, Math.random() * 200 + 50)
      }
      flip()
    } else {
      if (intervalRef.current) clearTimeout(intervalRef.current)
      setIsFlipped(value !== '')
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current)
    }
  }, [isSpinning, value, isNumber])

  return (
    <div className={styles.flipBox}>
      <div
        className={`${styles.flipBoxInner} ${isFlipped ? styles.flipped : ''}`}
        style={{
          transition: `transform ${isSpinning ? '0.1s' : '0.3s'}`,
        }}
      >
        <div className={styles.flipBoxFront}>
          {isSpinning ? (
            <div
              className={`${styles.content} ${isFrontTopHalf ? styles.topHalfVisible : styles.bottomHalfVisible}`}
            >
              {frontContent}
            </div>
          ) : (
            <div className={styles.content} />
          )}
          <div className={styles.divider} />
        </div>
        <div className={styles.flipBoxBack}>
          {isSpinning ? (
            <div
              className={`${styles.content} ${isFrontTopHalf ? styles.bottomHalfVisible : styles.topHalfVisible}`}
            >
              {backContent}
            </div>
          ) : (
            <div className={styles.content}>{value}</div>
          )}
          <div className={styles.divider} />
        </div>
      </div>
    </div>
  )
}

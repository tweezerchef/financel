/* eslint-disable no-nested-ternary */
import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from 'react'
import styles from './ui/SingleDisplay.module.css'

interface SingleDisplayProps {
  value: string
  isSpinning: boolean
  isNumber: boolean
  isClose?: boolean // Make this optional
}

export const SingleDisplay: FC<SingleDisplayProps> = memo(
  ({ value, isSpinning, isNumber, isClose }) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const [content, setContent] = useState({ front: '', back: '' })
    const [isFrontTopHalf, setIsFrontTopHalf] = useState(true)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const randomNumber = useMemo(
      () => () => Math.floor(Math.random() * 10).toString(),
      []
    )
    const randomArrow = useMemo(
      () => () => (Math.random() < 0.5 ? '↑' : '↓'),
      []
    )

    const flip = useCallback(() => {
      const newFrontContent = isNumber ? randomNumber() : randomArrow()
      const newBackContent = isNumber ? randomNumber() : randomArrow()
      setContent({ front: newFrontContent, back: newBackContent })
      setIsFrontTopHalf(Math.random() < 0.5)
      setIsFlipped((prev) => !prev)
      intervalRef.current = setTimeout(flip, Math.random() * 200 + 50)
    }, [isNumber, randomNumber, randomArrow])

    useEffect(() => {
      if (isSpinning) flip()
      else {
        if (intervalRef.current) clearTimeout(intervalRef.current)
        setIsFlipped(value !== '')
      }

      return () => {
        if (intervalRef.current) clearTimeout(intervalRef.current)
      }
    }, [isSpinning, flip, value])

    const flipBoxInnerClass = useMemo(
      () => `${styles.flipBoxInner} ${isFlipped ? styles.flipped : ''}`,
      [isFlipped]
    )

    const frontContentClass = useMemo(
      () =>
        `${styles.content} ${isFrontTopHalf ? styles.topHalfVisible : styles.bottomHalfVisible}`,
      [isFrontTopHalf]
    )

    const backContentClass = useMemo(
      () =>
        `${styles.content} ${isFrontTopHalf ? styles.bottomHalfVisible : styles.topHalfVisible}`,
      [isFrontTopHalf]
    )

    const contentClass = useMemo(() => {
      if (isClose) return styles.closeContent // Apply gradient to both numbers and arrows
      return styles.content
    }, [isClose])

    return (
      <div className={styles.flipBox}>
        <div
          className={flipBoxInnerClass}
          style={{
            transition: `transform ${isSpinning ? '0.1s' : '0.3s'}`,
          }}
        >
          <div className={styles.flipBoxFront}>
            {isSpinning ? (
              <div className={frontContentClass}>{content.front}</div>
            ) : (
              <div className={contentClass} />
            )}
            <div className={styles.divider} />
          </div>
          <div className={styles.flipBoxBack}>
            {isSpinning ? (
              <div className={backContentClass}>{content.back}</div>
            ) : (
              <div className={contentClass}>{value}</div>
            )}
            <div className={styles.divider} />
          </div>
        </div>
      </div>
    )
  }
)

SingleDisplay.displayName = 'SingleDisplay'

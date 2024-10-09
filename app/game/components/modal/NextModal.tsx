'use client'

/* eslint-disable no-nested-ternary */
import { Modal, Button, Text, Title, Center } from '@mantine/core'
import { useReward } from 'react-rewards'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { InterestRateChartClient } from './charts/interestRate/InterestRateChartClient'

import classes from './ui/NextModal.module.css'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

interface NextModalProps {
  opened: boolean
  close: () => void
  correct: boolean
  actual: string
  tries?: number
  time?: number
  challengeDate: string
  finalGuess: number | undefined
  type: 'Interest Rate' | 'Currency Price' | 'Stock Price'
  initialData?: Array<{ date: string; interestRate: number }>
}

export function NextModal({
  opened,
  close,
  correct,
  actual,
  tries,
  time,
  challengeDate,
  finalGuess,
  type,
  initialData,
}: NextModalProps) {
  const rewardRef = useRef<HTMLDivElement>(null)
  const { reward, isAnimating } = useReward('wrongAnswerReward', 'emoji', {
    emoji: ['💩'],
    elementCount: 20,
    elementSize: 30,
    spread: 40,
  })

  const animationCountRef = useRef(0)

  useEffect(() => {
    if (opened && !correct && !isAnimating && animationCountRef.current < 2) {
      const timer = setTimeout(() => {
        reward()
        animationCountRef.current += 1
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [opened, correct, reward, isAnimating])

  const title = correct ? 'Correct!' : `Wrong!`

  let timeString: string
  if (time && time < 60)
    timeString = `${time} ${time === 1 ? 'second' : 'seconds'}`
  else if (time) {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    timeString = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
  } else timeString = '0 seconds'

  const subTitle = correct
    ? `You took ${tries} ${tries === 1 ? 'try' : 'tries'} and ${timeString} to get today's ${type}`
    : `Sorry, try again tomorrow! The actual ${type} was ${actual}`

  const next =
    type === 'Interest Rate'
      ? 'currency'
      : type === 'Currency Price'
        ? 'stock'
        : type === 'Stock Price'
          ? 'final'
          : ''

  return (
    <div className={classes.nextModal}>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        classNames={{ root: classes.modalRoot, content: classes.modalContent }}
      >
        <div className={classes.modalInner}>
          <div
            ref={rewardRef}
            id="wrongAnswerReward"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {correct && <Confetti recycle numberOfPieces={200} />}

          <Center>
            <Title order={3} className={classes.modalTitle}>
              {title}
            </Title>
          </Center>
          <Center>
            <Text className={classes.modalText}>{subTitle}</Text>
          </Center>

          {type === 'Interest Rate' && initialData && (
            <InterestRateChartClient
              date={challengeDate}
              guess={finalGuess}
              initialData={initialData}
            />
          )}

          <Center>
            <Link href={`/game/${next}`} passHref legacyBehavior>
              <Button component="a" className={classes.nextButton}>
                Next
              </Button>
            </Link>
          </Center>
        </div>
      </Modal>
    </div>
  )
}

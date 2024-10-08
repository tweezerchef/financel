'use client'

/* eslint-disable no-nested-ternary */
import { Modal, Button, Text, Title } from '@mantine/core'
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
  type,
  initialData,
}: NextModalProps) {
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
        {correct && <Confetti recycle numberOfPieces={200} />}
        <Title order={3}>{title}</Title>
        <Text>{subTitle}</Text>
        <Link href={`/game/${next}`} passHref>
          {type === 'Interest Rate' && initialData && (
            <InterestRateChartClient
              date="Jan 25"
              guess={3.4}
              initialData={initialData}
            />
          )}
          <Button component="a">Next</Button>
        </Link>
      </Modal>
    </div>
  )
}

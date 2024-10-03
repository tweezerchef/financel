'use client'

/* eslint-disable no-nested-ternary */
import { Modal, Button, Text, Title } from '@mantine/core'
import Link from 'next/link'
import classes from './ui/NextModal.module.css'

interface NextModalProps {
  opened: boolean
  close: () => void
  correct: boolean
  actual: string
  tries?: number
  time?: number
  type: 'Interest Rate' | 'Currency Price' | 'Stock Price'
}

export function NextModal({
  opened,
  close,
  correct,
  actual,
  tries,
  time,
  type,
}: NextModalProps) {
  const title = correct ? 'Correct!' : `Wrong!`
  const subTitle = correct
    ? `You took ${tries} and ${time} seconds to get todays ${type}`
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
        title="Result"
        centered
        classNames={{ root: classes.modalRoot, content: classes.modalContent }}
      >
        <Title order={3}>{title}</Title>
        <Text>{subTitle}</Text>
        <Link href={`/${next}`} passHref>
          <Button component="a">Next</Button>
        </Link>
      </Modal>
    </div>
  )
}

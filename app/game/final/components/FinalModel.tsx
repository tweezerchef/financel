'use client'

/* eslint-disable no-nested-ternary */
import { Modal, Center } from '@mantine/core'
import { useState } from 'react'
import { ScoreChart } from './ScoreChart'
import classes from './ui/FinalModel.module.css'

export function FinalModel() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <Modal
      opened={isOpen}
      onClose={() => setIsOpen(false)}
      centered
      classNames={{ root: classes.modalRoot, content: classes.modalContent }}
    >
      <Center>
        <div className={classes.modalInner}>
          <ScoreChart />
        </div>
      </Center>
    </Modal>
  )
}

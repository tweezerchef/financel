import React from 'react'
import { ActionIcon } from '@mantine/core'
import classes from './ui/Key.module.css'

interface KeyProps {
  value: string
  icon?: React.ReactNode
  onClick: (value: string) => void
}

export const Key: React.FC<KeyProps> = ({ value, icon, onClick }) => {
  return (
    <ActionIcon className={classes.key} onClick={() => onClick(value)}>
      {icon || value}
    </ActionIcon>
  )
}

'use client'

import { Button, ButtonProps } from '@mantine/core'
import Link from 'next/link'
import { useState } from 'react'

interface RegisterButtonProps extends ButtonProps {
  disabled?: boolean
}

export function RegisterButton({ disabled, ...props }: RegisterButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    if (disabled) return
    setLoading(true)
  }

  return (
    <Link href="/registration" passHref>
      <Button
        variant="filled"
        size="md"
        radius="xl"
        onClick={handleClick}
        loading={loading}
        disabled={disabled}
        loaderProps={{ type: 'bars' }}
        {...props}
      >
        Register
      </Button>
    </Link>
  )
}

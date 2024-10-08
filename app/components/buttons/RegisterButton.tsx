import { Button } from '@mantine/core'
import Link from 'next/link'
import { useState } from 'react'

export function RegisterButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    // Simulate a delay before navigation // Adjust this delay as needed
  }

  return (
    <Link href="/registration" passHref>
      <Button
        variant="filled"
        size="md"
        radius="xl"
        onClick={handleClick}
        loading={loading}
        loaderProps={{ type: 'bars' }}
      >
        Register
      </Button>
    </Link>
  )
}

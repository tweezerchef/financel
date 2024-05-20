import { Box } from '@mantine/core'
import Image from 'next/image'

export function InterestRateDayOf() {
  return (
    <Box>
      <Image
        src="/JP.webp"
        alt="Interest Rate"
        width={250}
        height={166.5}
        quality={100}
        priority
      />
    </Box>
  )
}

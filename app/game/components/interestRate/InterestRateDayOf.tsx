import { Box } from '@mantine/core'
import Image from 'next/image'
import classes from './ui/InterestRateDayOf.module.css'

export function InterestRateDayOf() {
  return (
    <Box h="25%">
      <Image
        src="/JP.webp"
        alt="Interest Rate"
        width={500}
        height={333}
        quality={100}
        priority
      />
    </Box>
  )
}

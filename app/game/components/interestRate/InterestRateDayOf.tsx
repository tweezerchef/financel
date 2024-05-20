import { Container } from '@mantine/core'
import Image from 'next/image'
import classes from './ui/InterestRateDayOf.module.css'

export function InterestRateDayOf() {
  return (
    <Container className={classes.dayOfContainer}>
      <Image
        src="/JP.webp"
        alt="Interest Rate"
        width={250}
        height={166.5}
        quality={100}
        priority
      />
    </Container>
  )
}

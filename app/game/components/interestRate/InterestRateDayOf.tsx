import { Dispatch, SetStateAction } from 'react'
import { Container } from '@mantine/core'
import { DayOfImage } from './components/DayOfImage'
import classes from './ui/InterestRateDayOf.module.css'

interface InterestRateDayOfProps {
  dayOfSlide: 'image' | 'day' | 'guess'
  // eslint-disable-next-line react/no-unused-prop-types
  setDayOfSlide: Dispatch<SetStateAction<'image' | 'day' | 'guess'>>
}
export function InterestRateDayOf({ dayOfSlide }: InterestRateDayOfProps) {
  return (
    <Container className={classes.dayOfContainer}>
      {dayOfSlide === 'image' && <DayOfImage />}
    </Container>
  )
}

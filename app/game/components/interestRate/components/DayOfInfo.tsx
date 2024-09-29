import { Text, Paper } from '@mantine/core'
import classes from './ui/DayOfInfo.module.css'

interface DayOfInfoProps {
  date: string
  category: string
}
const getDuration = (rateType: string) => {
  switch (rateType) {
    case 'T_30':
      return 'Thirty Year Treasury Bond'
    case 'T_20':
      return 'Twenty Year Treasury Bond'
    case 'T_10':
      return 'Ten Year Treasury Bond'
    case 'T_5':
      return 'Five Year Treasury Bond'
    case 'T_1':
      return 'One Year Treasury Bond'
    case 'T_OVERNIGHT':
      return 'Overnight'
    default:
      return 'Unknown Duration'
  }
}

export function DayOfInfo({ date, category }: DayOfInfoProps) {
  const duration = getDuration(category)
  return (
    <div className={classes.infoWrapper}>
      <Paper
        shadow="md"
        withBorder
        radius="md"
        p="md"
        className={classes.paper}
      >
        <Text>{date}</Text>
        <Text>{duration}</Text>
      </Paper>
    </div>
  )
}

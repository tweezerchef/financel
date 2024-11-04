import { Text, Paper, Container } from '@mantine/core'
import { formatDateForChart } from '../../../lib/formatDateForChart'
import { addOrdinalSuffix } from '../../../lib/addOrdinalSuffix'
import classes from '../../../ui/DayOfInfo.module.css'

interface DayOfInfoProps {
  date: string
  category: string
}
const getDuration = (rateType: string) => {
  switch (rateType) {
    case 'T_30':
      return '30-Year Treasury'
    case 'T_20':
      return '20-Year Treasury'
    case 'T_10':
      return '10-Year Treasury'
    case 'T_5':
      return '5-Year Treasury'
    case 'T_1':
      return '1-Year Treasury'
    case 'T_OVERNIGHT':
      return 'Overnight Rate'
    default:
      return 'Unknown Rate'
  }
}

export function DayOfInfo({ date, category }: DayOfInfoProps) {
  const duration = getDuration(category)
  const formattedDate = formatDateForChart(date)
  console.log('formattedDate', formattedDate)
  const [month, dayWithComma, year] = formattedDate.split(' ')
  const day = parseInt(dayWithComma, 10)
  const dayWithSuffix = addOrdinalSuffix(day)
  const finalDate = `${month} ${dayWithSuffix}, ${year}`

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <div className={classes.textContainer}>
          <Text className={classes.date}>On {finalDate}</Text>
          <Text className={classes.bondType}>
            The rate on the {duration} was
          </Text>
        </div>
      </Paper>
    </Container>
  )
}

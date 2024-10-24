import { Text, Paper, Container } from '@mantine/core'
import classes from '../../../ui/DayOfInfo.module.css'
import { formatDateForChart } from '../../../lib/formatDateForChart'
import { addOrdinalSuffix } from '../../../lib/addOrdinalSuffix'

interface StockDayOfInfoProps {
  date: string
  stockName: string
}

export function StockDayOfInfo({ date, stockName }: StockDayOfInfoProps) {
  const formattedDate = formatDateForChart(date)
  const [month, dayWithComma, year] = formattedDate.split(' ')
  const day = parseInt(dayWithComma, 10)
  const dayWithSuffix = addOrdinalSuffix(day)
  const finalDate = `${month} ${dayWithSuffix}, ${year}`

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <div className={classes.textContainer}>
          <Text className={classes.date}>{finalDate}</Text>
          <Text className={classes.bondType}>{stockName}</Text>
        </div>
      </Paper>
    </Container>
  )
}

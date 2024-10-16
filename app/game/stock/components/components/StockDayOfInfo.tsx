import { Text, Paper, Container } from '@mantine/core'
import classes from './ui/StockDayOfInfo.module.css'
import { formatDate } from '../../../lib/formatDate'
import { addOrdinalSuffix } from '../../../lib/addOrdinalSuffix'

interface StockDayOfInfoProps {
  date: string
  stockName: string
}

export function StockDayOfInfo({ date, stockName }: StockDayOfInfoProps) {
  const formattedDate = formatDate(date)
  const [month, dayWithComma, year] = formattedDate.split(' ')
  const day = parseInt(dayWithComma, 10)
  const dayWithSuffix = addOrdinalSuffix(day)
  const finalDate = `${month} ${dayWithSuffix}, ${year}`

  return (
    <Container className={classes.container}>
      <Paper
        shadow="md"
        withBorder
        radius="md"
        p="md"
        className={classes.paper}
      >
        <div className={classes.textContainer}>
          <Text className={classes.date}>{finalDate}</Text>
          <Text className={classes.stockName}>{stockName}</Text>
        </div>
      </Paper>
    </Container>
  )
}

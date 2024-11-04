import { Text, Paper, Container } from '@mantine/core'
import classes from '../../../ui/DayOfInfo.module.css'
import { formatDate } from '../../../lib/formatDate'
import { addOrdinalSuffix } from '../../../lib/addOrdinalSuffix'

interface CurrencyDayOfInfoProps {
  date: string
  currency: string
}

export function CurrencyDayOfInfo({ date, currency }: CurrencyDayOfInfoProps) {
  const formattedDate = formatDate(date)
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
            The USD/{currency} exchange rate
          </Text>
        </div>
      </Paper>
    </Container>
  )
}

import { Text, Paper, Container } from '@mantine/core'
import classes from './ui/CurrencyDayOfInfo.module.css'
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
      <Paper
        shadow="md"
        withBorder
        radius="md"
        p="md"
        className={classes.paper}
      >
        <div className={classes.textContainer}>
          <Text size="lg" className={classes.date}>
            {finalDate}
          </Text>
          <Text size="md" className={classes.currencyType}>
            {currency}
          </Text>
        </div>
      </Paper>
    </Container>
  )
}

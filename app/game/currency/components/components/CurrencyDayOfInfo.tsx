import { Text, Paper, Container } from '@mantine/core'
import classes from './ui/CurrencyDayOfInfo.module.css'

interface CurrencyDayOfInfoProps {
  date: string
  currency: string
}

export function CurrencyDayOfInfo({ date, currency }: CurrencyDayOfInfoProps) {
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
            {date}
          </Text>
          <Text size="md" className={classes.currencyType}>
            {currency}
          </Text>
        </div>
      </Paper>
    </Container>
  )
}

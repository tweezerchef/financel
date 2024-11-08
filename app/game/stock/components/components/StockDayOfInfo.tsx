import { Text, Paper, Container } from '@mantine/core'
import classes from '../../../ui/DayOfInfo.module.css'
import { formatDateForChart } from '../../../lib/formatDateForChart'
import { addOrdinalSuffix } from '../../../lib/addOrdinalSuffix'

interface StockDayOfInfoProps {
  date: string
  stockName: string
}
const getStockName = (stockName: string) => {
  switch (stockName) {
    case 'AAPL':
      return 'Apple'
    case 'NKE':
      return 'Nike'
    case 'NEE':
      return 'NextEra Energy'
    case 'XOM':
      return 'Exxon Mobil'
    case 'MSFT':
      return 'Microsoft'
    case 'WMT':
      return 'Walmart'
    case 'GE':
      return 'General Electric'
    case 'DIS':
      return 'Disney'
    case 'T':
      return 'AT&T'
    case 'ATT':
      return 'AT&T'
    case 'MRK':
      return 'Merck'
    case 'HD':
      return 'Home Depot'
    case 'BA':
      return 'Boeing'
    case 'PG':
      return 'Procter & Gamble'
    case 'JNJ':
      return 'Johnson & Johnson'
    case 'MCD':
      return 'McDonalds'
    case 'KO':
      return 'Coca-Cola'
    case 'INTC':
      return 'Intel'
    default:
      return stockName
  }
}

export function StockDayOfInfo({ date, stockName }: StockDayOfInfoProps) {
  const formattedStockName = getStockName(stockName)
  const formattedDate = formatDateForChart(date)
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
            {formattedStockName} was trading at
          </Text>
        </div>
      </Paper>
    </Container>
  )
}

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-')
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const monthIndex = parseInt(month, 10) - 1
  const dayNumber = parseInt(day, 10)
  return `${monthNames[monthIndex]} ${dayNumber}, ${year}`
}

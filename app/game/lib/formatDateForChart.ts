/* eslint-disable @typescript-eslint/no-unused-vars */
export function formatDateForChart(date: string): string {
  try {
    const [year, month, day] = date.split('T')[0].split('-')
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return `${monthNames[parseInt(month, 10) - 1]} ${parseInt(day, 10)} ${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return date
  }
}

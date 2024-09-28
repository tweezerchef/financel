export function dateOnly(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

console.log(dateOnly())

export function dateOnlyPrisma(): Date {
  const today = new Date()
  const utcDate = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  )

  return utcDate
}

console.log(dateOnlyPrisma())

/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import prisma from '../../lib/prisma/prisma'

type IRCategory = 'T_1' | 'T_5' | 'T_10' | 'T_20' | 'T_30'

function createDateOnly(dateString: string): Date {
  const [month, day, year] = dateString.split('/').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export async function importInterestRatesChunk(offset: number, limit: number) {
  const csvFilePath = path.resolve(process.cwd(), 'public/InterestRates.csv')
  const csvData = fs.readFileSync(csvFilePath, 'utf8')

  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  })

  const chunk = records.slice(offset, offset + limit)
  let importedCount = 0

  for (const record of chunk) {
    const date = createDateOnly(record.Date)

    if (Number.isNaN(date.getTime())) {
      console.error(`Invalid date format for row: ${record.Date}`)
      continue
    }

    // Find or create the date entry
    let dateEntry = await prisma.dates.findUnique({
      where: { date },
    })
    if (!dateEntry)
      dateEntry = await prisma.dates.create({
        data: { date },
      })

    // Map CSV columns to IRCategories
    const categoryMap: { [key: string]: IRCategory } = {
      '1 Yr': 'T_1',
      '5 Yr': 'T_5',
      '10 Yr': 'T_10',
      '20 Yr': 'T_20',
      '30 Yr': 'T_30',
    }

    // Create or update interest rates for each category
    for (const [csvColumn, category] of Object.entries(categoryMap)) {
      const rate = parseFloat(record[csvColumn])

      if (Number.isNaN(rate)) {
        console.warn(
          `Invalid rate for ${csvColumn} on ${record.Date}: ${record[csvColumn]}`
        )
        continue
      }

      let interestRate = await prisma.interestRate.findFirst({
        where: { category },
      })

      if (!interestRate)
        interestRate = await prisma.interestRate.create({
          data: { category },
        })

      await prisma.interestRatePrice.create({
        data: {
          interestId: interestRate.id,
          rate,
          dateId: dateEntry.id,
        },
      })
    }

    console.log(`Imported data for ${record.Date}`)
    importedCount++
  }

  return {
    message: `Imported ${importedCount} records`,
    nextOffset: offset + importedCount,
    hasMore: offset + importedCount < records.length,
  }
}

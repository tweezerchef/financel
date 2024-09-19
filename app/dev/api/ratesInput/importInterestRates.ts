/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { parse } from 'csv-parse'
import fs from 'fs'
import path from 'path'
import prisma from '../../../lib/prisma/prisma'

export async function importInterestRates() {
  const csvFilePath = path.resolve(process.cwd(), 'public/InterestRates.csv')
  const csvData = fs.readFileSync(csvFilePath, 'utf8')

  const parser = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  })

  for await (const record of parser) {
    // Parse the date from the CSV
    const date = new Date(record.Date)

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
    const categoryMap: { [key: string]: keyof typeof IRCategory } = {
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
  }

  console.log('Import completed successfully')
}

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { parse } from 'csv-parse'
import fs from 'fs'
import path from 'path'
import prisma from '../../../../lib/prisma/prisma'

export async function importInterestRates() {
  const csvFilePath = path.resolve(process.cwd(), 'public/InterestRates.csv')
  const csvData = fs.readFileSync(csvFilePath, 'utf8')

  const parser = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  })

  let importedCount = 0

  for await (const record of parser) {
    // Parse the date from MM/DD/YY format
    const [month, day, year] = record.Date.split('/')
    // Convert 2-digit year to 4-digit year and ensure UTC
    const fullYear =
      parseInt(year, 10) + (parseInt(year, 10) < 50 ? 2000 : 1900)
    const date = new Date(
      Date.UTC(fullYear, parseInt(month, 10) - 1, parseInt(day, 10))
    )

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
      '1 Mo': 'T_1M',
      '3 Mo': 'T_3M',
      '4 Mo': 'T_4M',
      '6 Mo': 'T_6M',
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
          `Invalid rate for ${csvColumn} on ${date.toISOString()}: ${record[csvColumn]}`
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

    console.log(`Imported data for ${date.toISOString()}`)
    // eslint-disable-next-line no-plusplus
    importedCount++
  }

  return {
    message: `Import completed successfully. Imported ${importedCount} dates.`,
  }
}

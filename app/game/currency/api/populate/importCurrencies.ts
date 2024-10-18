/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// File: app/api/import-currencies/importCurrencies.ts
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { Prisma } from '@prisma/client'
import { prisma } from '../../../../lib/prisma/prisma'

const MAX_SAFE_VALUE = 999999.999999

export async function importCurrencies() {
  const csvFiles = [
    path.resolve(process.cwd(), 'public/1990-1999_FRB_H10.csv'),
    path.resolve(process.cwd(), 'public/2000-2024_FRB_H10.csv'),
  ]

  let importedCount = 0

  for (const csvFilePath of csvFiles) {
    const csvData = fs.readFileSync(csvFilePath, 'utf8')
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    })

    for (const record of records) {
      const dateStr = record['Series Description']
      if (!dateStr || dateStr === 'ND') {
        console.warn(
          `Skipping record with invalid date: ${JSON.stringify(record)}`
        )
        continue
      }

      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        console.error(`Invalid date format for row: ${dateStr}`)
        continue
      }
      let dateEntry = await prisma.dates.findUnique({
        where: { date },
      })
      if (!dateEntry)
        dateEntry = await prisma.dates.create({
          data: { date },
        })

      const currencyColumns = [
        'Australian Dollar',
        'Euro-Area Euro',
        'New Zealand Dollar',
        'United Kingdom Pound',
        'Brazilian Real',
        'Canadian Dollar',
        'Chinese Yuan',
        'Danish Krone',
        'Hong Kong Dollar',
        'Indian Rupee',
        'Japanese Yen',
        'Malaysian Ringgit',
        'Mexican Peso',
        'Norwegian Krone',
        'South African Rand',
        'Singapore Dollar',
        'South Korean Won',
        'Sri Lankan Rupee',
        'Swedish Krona',
        'Swiss Franc',
        'Taiwanese N.T. Dollar',
        'Thailand Baht',
      ]

      for (const currencyName of currencyColumns) {
        const valueStr = record[currencyName]
        if (!valueStr || valueStr === 'ND' || valueStr === '') {
          console.warn(`No data for ${currencyName} on ${dateStr}`)
          continue
        }

        const value = parseFloat(valueStr)
        if (isNaN(value)) {
          console.warn(
            `Invalid data for ${currencyName} on ${dateStr}: ${valueStr}`
          )
          continue
        }

        const safeValue = Math.min(value, MAX_SAFE_VALUE)

        const currency = await prisma.currency.upsert({
          where: { name: currencyName },
          update: {
            lowestValue: Prisma.Decimal.min(new Prisma.Decimal(safeValue)),
            highestValue: Prisma.Decimal.max(new Prisma.Decimal(safeValue)),
          },
          create: {
            name: currencyName,
            lowestValue: new Prisma.Decimal(safeValue),
            highestValue: new Prisma.Decimal(safeValue),
          },
        })

        await prisma.currencyValue.create({
          data: {
            currencyId: currency.id,
            value: new Prisma.Decimal(safeValue),
            dateId: dateEntry.id,
          },
        })
      }

      console.log(`Imported data for ${dateStr}`)
      importedCount++
    }
  }

  return {
    message: `Imported ${importedCount} records`,
  }
}

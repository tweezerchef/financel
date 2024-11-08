/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { Prisma } from '@prisma/client'
import prisma from '../../../../lib/prisma/prisma'

const MAX_SAFE_VALUE = 999.99
const ISO_TO_FULL_NAME: { [key: string]: string } = {
  CZK: 'Czech Koruna',
  ARS: 'Argentine Peso',
  RUB: 'Russian Ruble',
  PHP: 'Philippine Peso',
  TRY: 'Turkish Lira',
  CLP: 'Chilean Peso',
  PLN: 'Polish Zloty',
  PEN: 'Peruvian Sol',
}
export async function importNewCurrency() {
  const csvFilePath = path.resolve(process.cwd(), './newCurrency.csv')
  let importedCount = 0

  const csvData = fs.readFileSync(csvFilePath, 'utf8')
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  })

  for (const record of records) {
    const dateStr = record.Date
    if (!dateStr) {
      console.warn(
        `Skipping record with invalid date: ${JSON.stringify(record)}`
      )
      continue
    }

    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) {
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

    // We'll use the closing price as our value
    const value = parseFloat(record.Close)
    if (Number.isNaN(value)) {
      console.warn(`Invalid closing value for ${dateStr}: ${record.Close}`)
      continue
    }

    if (value > MAX_SAFE_VALUE) {
      console.warn(
        `Skipping ${record.ISOCode} - value ${value} exceeds maximum allowed value of ${MAX_SAFE_VALUE}`
      )
      continue
    }

    const currencyCode = record.ISOCode
    const currencyName = ISO_TO_FULL_NAME[currencyCode]

    if (!currencyName) {
      console.warn(`Skipping unknown currency code: ${currencyCode}`)
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

    console.log(`Imported data for ${dateStr} - ${currencyName}`)
    importedCount++
  }

  return {
    message: `Imported ${importedCount} records`,
  }
}

importNewCurrency()

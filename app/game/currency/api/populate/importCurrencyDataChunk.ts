/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { Decimal } from '@prisma/client/runtime/library'
import prisma from '../../../../lib/prisma/prisma'

export async function importCurrencyDataChunk(offset: number, limit: number) {
  const csvFiles = [
    path.resolve(process.cwd(), 'public/1990-1999_FRB_H10.csv'),
    path.resolve(process.cwd(), 'public/2000-2024_FRB_H10.csv'),
  ]

  let allRecords: any[] = []
  let currencyNames: string[] = []

  for (const csvFile of csvFiles) {
    const csvData = fs.readFileSync(csvFile, 'utf8')
    const fileRecords = parse(csvData, {
      skip_empty_lines: true,
    })

    if (currencyNames.length === 0) currencyNames = fileRecords[0].slice(1)

    allRecords = allRecords.concat(fileRecords.slice(6))
  }

  const chunk = allRecords.slice(offset, offset + limit)
  let importedCount = 0

  for (const record of chunk) {
    const dateStr = record[0]
    if (!dateStr || dateStr === 'ND') {
      console.log(`Skipping row with no date: ${dateStr}`)
      continue
    }

    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) {
      console.error(`Invalid date format for row: ${dateStr}`)
      continue
    }

    console.log(`Processing data for ${dateStr}`)

    try {
      // Find or create the date entry
      let dateEntry = await prisma.dates.findUnique({
        where: { date },
      })
      if (!dateEntry) {
        dateEntry = await prisma.dates.create({
          data: { date },
        })
        console.log(`Created new date entry for ${dateStr}`)
      }

      let validEntriesCount = 0

      for (let i = 1; i < record.length; i++) {
        const currencyName = currencyNames[i - 1]
        const value = record[i]

        if (!currencyName || !value || value === 'ND') continue

        const parsedValue = parseFloat(value)
        if (Number.isNaN(parsedValue)) {
          console.warn(
            `Invalid value for ${currencyName} on ${dateStr}: ${value}`
          )
          continue
        }

        // Find or create the currency
        let currency = await prisma.currency.findUnique({
          where: { name: currencyName },
        })
        if (!currency) {
          currency = await prisma.currency.create({
            data: {
              name: currencyName,
              lowestValue: new Decimal(parsedValue),
              highestValue: new Decimal(parsedValue),
            },
          })
          console.log(`Created new currency: ${currencyName}`)
        } else {
          // Update lowest and highest values if necessary
          if (parsedValue < currency.lowestValue.toNumber())
            await prisma.currency.update({
              where: { id: currency.id },
              data: { lowestValue: new Decimal(parsedValue) },
            })

          if (parsedValue > currency.highestValue.toNumber())
            await prisma.currency.update({
              where: { id: currency.id },
              data: { highestValue: new Decimal(parsedValue) },
            })
        }

        // Create currency value
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newCurrencyValue = await prisma.currencyValue.create({
          data: {
            value: new Decimal(parsedValue),
            currency: { connect: { id: currency.id } },
            date: { connect: { id: dateEntry.id } },
          },
        })

        console.log(
          `Created new currency value for ${currencyName} on ${dateStr}: ${parsedValue}`
        )
        validEntriesCount++
      }

      console.log(`Imported ${validEntriesCount} valid entries for ${dateStr}`)
      importedCount++
    } catch (error) {
      console.error(`Error processing data for ${dateStr}:`, error)
    }
  }

  // Verify imported data
  await verifyImportedData(offset, importedCount)

  return {
    message: `Imported ${importedCount} records`,
    nextOffset: offset + importedCount,
    hasMore: offset + importedCount < allRecords.length,
  }
}

async function verifyImportedData(offset: number, count: number) {
  const totalDates = await prisma.dates.count()
  const totalCurrencies = await prisma.currency.count()
  const totalCurrencyValues = await prisma.currencyValue.count()

  console.log(`Verification Results:`)
  console.log(`Total Dates in DB: ${totalDates}`)
  console.log(`Total Currencies in DB: ${totalCurrencies}`)
  console.log(`Total Currency Values in DB: ${totalCurrencyValues}`)
  console.log(`Expected records in this chunk: ${count}`)

  if (totalDates < offset + count)
    console.warn(
      `Warning: Number of dates (${totalDates}) is less than expected (${offset + count})`
    )

  if (totalCurrencyValues < (offset + count) * totalCurrencies)
    console.warn(
      `Warning: Number of currency values (${totalCurrencyValues}) is less than expected (${(offset + count) * totalCurrencies})`
    )
}

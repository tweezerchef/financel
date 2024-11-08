/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import prisma from '../../../../lib/prisma/prisma'

function createDateOnly(dateString: string): Date | null {
  if (!dateString) {
    console.error('Date string is undefined or empty')
    return null
  }
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    console.error(`Invalid date format: ${dateString}`)
    return null
  }
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
}

export async function importHistoricalStocks() {
  try {
    const csvFile = path.resolve(process.cwd(), './newStock.csv')
    let importedCount = 0

    const csvData = fs.readFileSync(csvFile, 'utf8')
    const records = parse(csvData, {
      skip_empty_lines: true,
      columns: true,
    })

    for (const record of records) {
      // Get date from the empty string key since it's the first column without a header
      const dateStr = record[''] || Object.values(record)[0]
      const date = createDateOnly(dateStr)
      if (!date) {
        console.error(`Invalid date for row:`, record)
        continue
      }

      let dateEntry = await prisma.dates.findUnique({
        where: { date },
      })
      if (!dateEntry)
        dateEntry = await prisma.dates.create({
          data: { date },
        })

      const price = parseFloat(record.Close)
      if (Number.isNaN(price)) {
        console.error(`Invalid price for row:`, record)
        continue
      }

      let stock = await prisma.stock.findUnique({
        where: { name: record.Ticker },
      })
      if (!stock)
        stock = await prisma.stock.create({
          data: { name: record.Ticker },
        })

      await prisma.stockPrice.create({
        data: {
          stockId: stock.id,
          price,
          dateId: dateEntry.id,
        },
      })

      importedCount++
      if (importedCount % 1000 === 0)
        console.log(`Imported ${importedCount} records...`)
    }

    console.log(
      `Import completed successfully. Total records: ${importedCount}`
    )
    return {
      message: 'Import completed successfully',
      count: importedCount,
    }
  } catch (error) {
    console.error('An error occurred during historical stock import:', error)
    return {
      message: 'Import failed',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

importHistoricalStocks()

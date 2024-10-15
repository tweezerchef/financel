/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
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
  if (isNaN(date.getTime())) {
    console.error(`Invalid date format: ${dateString}`)
    return null
  }
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
}

export async function importStocks() {
  try {
    const csvFiles = [
      path.resolve(process.cwd(), 'public/stock_data.csv'),
      path.resolve(process.cwd(), 'public/addtl_stock_data.csv'),
    ]
    let allRecords: Array<{ Date: string; Close: string; Ticker: string }> = []

    for (const csvFile of csvFiles)
      try {
        const csvData = fs.readFileSync(csvFile, 'utf8')
        const fileRecords = parse(csvData, {
          skip_empty_lines: true,
          columns: (header: string[]) => [
            'Date',
            'Open',
            'High',
            'Low',
            'Close',
            'Volume',
            'Unknown1',
            'Unknown2',
            'Ticker',
          ],
        })
        allRecords = allRecords.concat(
          fileRecords.map((record: any) => ({
            Date: record.Date,
            Close: record.Close,
            Ticker: record.Ticker,
          }))
        )
      } catch (error) {
        console.error(`Error reading or parsing file ${csvFile}:`, error)
      }

    for (const record of allRecords) {
      const date = createDateOnly(record.Date)
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
      if (isNaN(price)) {
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
        data: { stockId: stock.id, price, dateId: dateEntry.id },
      })
    }

    console.log('Import completed successfully')
    return {
      message: 'Import completed successfully',
    }
  } catch (error) {
    console.error('An error occurred during stock import:', error)
    return {
      message: 'Import failed',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

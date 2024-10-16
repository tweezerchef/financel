/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import { getChartDataForCurrency } from '../../../lib/dbFunctions/getChartDataForCurrency'
import { getChartDataForInterestRate } from '../../../lib/dbFunctions/getChartDataForInterestRate'
import { getChartDataForStock } from '../../../lib/dbFunctions/getChartDataForStock'
import prisma from '../../../lib/prisma/prisma'

export async function GET() {
  try {
    const dailyChallenge = await prisma.dailyChallenge.findFirst({
      orderBy: { challengeDate: 'desc' },
      select: {
        id: true,
        challengeDate: true,
        date: {
          select: {
            date: true,
          },
        },
        currencyValue: {
          select: {
            value: true,
            currency: {
              select: {
                name: true,
              },
            },
          },
        },
        interestRate: {
          select: {
            rate: true,
            rateType: {
              select: {
                category: true,
              },
            },
          },
        },
        stockPrice: {
          select: {
            price: true,
            stock: {
              select: {
                name: true,
              },
            },
          },
        },
        currencyYearData: {
          select: {
            dataPoints: true,
          },
        },
        interestRateYearData: {
          select: {
            dataPoints: true,
          },
        },
        stockYearData: {
          select: {
            dataPoints: true,
          },
        },
      },
    })

    if (!dailyChallenge)
      return NextResponse.json(
        { message: 'No daily challenge found' },
        { status: 404 }
      )

    const currencyChartData =
      (dailyChallenge.currencyYearData?.dataPoints as Array<{
        date: string
        value: number
      }>) || []
    const interestRateChartData =
      (dailyChallenge.interestRateYearData?.dataPoints as Array<{
        date: string
        rate: number
      }>) || []
    const stockChartData =
      (dailyChallenge.stockYearData?.dataPoints as Array<{
        date: string
        price: number
      }>) || []

    // Calculate the range of values in currencyChartData
    const currencyValues = currencyChartData.map((point) => point.value)
    const currencyMinValue = Math.min(...currencyValues)
    const currencyMaxValue = Math.max(...currencyValues)
    const currencyRange = currencyMaxValue - currencyMinValue

    // Process the currency value
    const currencyValue = dailyChallenge.currencyValue?.value.toString() || ''
    const decimal = currencyValue.indexOf('.')
    console.log(decimal)
    const response = {
      date: dailyChallenge.challengeDate,
      currency: dailyChallenge.currencyValue?.currency.name,
      currencyValue: dailyChallenge.currencyValue?.value,
      currencyChartData,
      currencyDecimal: decimal,
      currencyRange,
      interestRateCategory: dailyChallenge.interestRate.rateType.category,
      interestRate: dailyChallenge.interestRate.rate,
      interestRateChartData,
      stockName: dailyChallenge.stockPrice?.stock.name,
      stockPrice: dailyChallenge.stockPrice?.price,
      stockChartData,
    }

    return NextResponse.json({ data: response }, { status: 200 })
  } catch (e) {
    console.error('Error fetching daily challenge:', e)
    return NextResponse.json(
      { message: 'Error fetching daily challenge' },
      { status: 500 }
    )
  }
}

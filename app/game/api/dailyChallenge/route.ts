/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma/prisma'
import { getChartDataForCurrency } from '../../../lib/dbFunctions/getChartDataForCurrency'
import { getChartDataForStock } from '../../../lib/dbFunctions/getChartDataForStock'
import { getChartDataForInterestRate } from '../../../lib/dbFunctions/getChartDataForInterestRate'

export async function GET() {
  try {
    const dailyChallenge = await prisma.dailyChallenge.findFirst({
      orderBy: { challengeDate: 'desc' },
      select: {
        id: true,
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

    const currencyChartData = await getChartDataForCurrency({
      dailyChallengeId: dailyChallenge.id,
    })
    const interestRateChartData = await getChartDataForInterestRate({
      dailyChallengeId: dailyChallenge.id,
    })

    const stockChartData = await getChartDataForStock({
      dailyChallengeId: dailyChallenge.id,
    })
    // Calculate the range of values in currencyChartData
    const currencyValues = currencyChartData.map((point) => point.value)
    const currencyMinValue = Math.min(...currencyValues)
    const currencyMaxValue = Math.max(...currencyValues)
    const currencyRange = currencyMaxValue - currencyMinValue

    // Process the currency value
    const currencyValue = dailyChallenge.currencyValue?.value.toString() || ''
    const currencyDecimal = currencyValue.indexOf('.')
    const stockDecimal = dailyChallenge.stockPrice?.price
      .toString()
      .indexOf('.')
    const response = {
      date: dailyChallenge.date.date,
      currency: dailyChallenge.currencyValue?.currency.name,
      currencyValue: dailyChallenge.currencyValue?.value,
      currencyChartData,
      currencyDecimal,
      currencyRange,
      interestRateCategory: dailyChallenge.interestRate.rateType.category,
      interestRate: dailyChallenge.interestRate.rate,
      interestRateChartData,
      stockName: dailyChallenge.stockPrice?.stock.name,
      stockPrice: dailyChallenge.stockPrice?.price,
      stockDecimal,
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

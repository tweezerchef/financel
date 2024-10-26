import { NextResponse } from 'next/server'

export async function GET(context: { params: { id: string } }) {
  const { id } = context.params
  const chartImageUrl = `https://${process.env.SERVER_AWS_S3_BUCKET_NAME}.s3.${process.env.SERVER_AWS_REGION}.amazonaws.com/chart/${id}`

  const metadata = {
    title: 'Financle Score Chart',
    description: 'Check out my Financle score chart!',
    openGraph: {
      title: 'Financle Score Chart',
      description: 'Check out my Financle score chart!',
      images: [
        {
          url: chartImageUrl,
          width: 1200,
          height: 630,
          alt: 'Financle Score Chart',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Financle Score Chart',
      description: 'Check out my Financle score chart!',
      images: [chartImageUrl],
    },
  }

  return NextResponse.json(metadata)
}

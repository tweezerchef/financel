import { Metadata } from 'next'
import Image from 'next/image'

type ParamsType = { chartId: string }

interface ChartPageProps {
  params: Promise<ParamsType>
}

interface ChartMetadataProps {
  params: Promise<ParamsType>
}

export async function generateMetadata({
  params,
}: ChartMetadataProps): Promise<Metadata> {
  const { chartId } = await params

  const chartImageUrl = `https://${process.env.NEXT_PUBLIC_SERVER_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_SERVER_AWS_REGION}.amazonaws.com/chart/${chartId}`

  try {
    const headResponse = await fetch(chartImageUrl, { method: 'HEAD' })
    if (!headResponse.ok) {
      console.error('Image not found:', chartImageUrl)
      return {}
    }
  } catch (error) {
    console.error('Error checking image:', error)
    return {}
  }

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/chartShare/${chartId}`

  return {
    title: 'My Financle Score Chart',
    description: 'Check out my Financle score chart!',
    openGraph: {
      title: 'My Financle Score Chart',
      description: 'Check out my Financle score chart!',
      url: pageUrl,
      images: [
        {
          url: chartImageUrl,
          width: 800,
          height: 600,
          alt: 'My Financle Score Chart',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'My Financle Score Chart',
      description: 'Check out my Financle score chart!',
      images: [chartImageUrl],
    },
  }
}

export default async function ChartPage({ params }: ChartPageProps) {
  const { chartId } = await params

  const chartImageUrl = `https://${process.env.NEXT_PUBLIC_SERVER_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_SERVER_AWS_REGION}.amazonaws.com/chart/${chartId}`

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>My Score Chart</h1>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <Image
          src={chartImageUrl}
          alt="Score Chart"
          width={800}
          height={600}
          style={{ width: '100%', height: 'auto' }}
          priority
        />
      </div>
    </div>
  )
}

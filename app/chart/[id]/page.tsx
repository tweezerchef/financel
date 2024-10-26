/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import Image from 'next/image'
import { Metadata } from 'next'

type Props = {
  params: { id: string }
}

export default function ChartPage({ params }: Props) {
  return (
    <div>
      <h1>Financle Score Chart</h1>
      <Image
        src={`https://${process.env.SERVER_AWS_S3_BUCKET_NAME}.s3.${process.env.SERVER_AWS_REGION}.amazonaws.com/chart/${params.id}`}
        alt="Score Chart"
        width={500}
        height={300}
        priority
      />
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Financle Score Chart',
    description: 'Check out my Financle score chart!',
  }
}

import { Metadata } from 'next'
import Image from 'next/image'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const res = await fetch(`http://localhost:3000/api/chartMetadata/${id}`)
  const metadata = await res.json()

  return metadata
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

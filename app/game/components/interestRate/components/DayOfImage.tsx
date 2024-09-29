import Image from 'next/image'

export function DayOfImage() {
  return (
    <Image
      src="/JP.webp"
      alt="Interest Rate"
      width={250}
      height={166.5}
      quality={80}
      priority
    />
  )
}

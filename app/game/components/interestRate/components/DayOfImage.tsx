import Image from 'next/image'
import classes from './ui/DayOfImage.module.css'

export function DayOfImage() {
  return (
    <div className={classes.imageWrapper}>
      <Image
        src="/JP.webp"
        alt="Interest Rate"
        quality={80}
        width={250}
        height={166.5}
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  )
}

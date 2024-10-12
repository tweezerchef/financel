import Image from 'next/image'
import classes from './ui/DayOfImage.module.css'

export function DayOfImage() {
  return (
    <div className={classes.imageWrapper}>
      <Image
        src="/JP.webp"
        alt="Interest Rate"
        quality={70}
        width={250}
        height={166.5}
        priority
      />
    </div>
  )
}

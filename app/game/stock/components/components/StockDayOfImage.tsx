import Image from 'next/image'
import classes from '../../../ui/DayOfImage.module.css'

export function StockDayOfImage() {
  return (
    <div className={classes.imageWrapper}>
      <Image
        src="/stockImage.png"
        alt="Currency"
        quality={70}
        width={500}
        height={331}
        priority
      />
    </div>
  )
}

import Image from 'next/image'
import classes from './ui/StockDayOfImage.module.css'

export function StockDayOfImage() {
  return (
    <div className={classes.imageWrapper}>
      <Image
        src="/FX-684x382.webp"
        alt="Currency"
        quality={70}
        width={684}
        height={382}
        priority
      />
    </div>
  )
}

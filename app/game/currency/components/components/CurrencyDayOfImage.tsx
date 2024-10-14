import Image from 'next/image'
import classes from './ui/CurrencyDayOfInfo.module.css'

export function CurrencyDayOfImage() {
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

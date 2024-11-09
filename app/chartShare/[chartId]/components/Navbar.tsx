import Image from 'next/image'
import Link from 'next/link'
import classes from './ui/Navbar.module.css'

export function Navbar() {
  return (
    <Link href="/" className={classes.navbarContainer}>
      <div className={classes.logoContainer}>
        <Image src="/favicon.svg" alt="Financel Logo" width={50} height={50} />
      </div>

      <div className={classes.titleContainer}>
        <span className={classes.title}>Financle</span>
      </div>
    </Link>
  )
}

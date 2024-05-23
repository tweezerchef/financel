import Image from 'next/image'
import { Container } from '@mantine/core'
import { Footer } from './components/layout/Footer'
import classes from './ui/Layout.module.css'
import { Navbar } from './components/layout/Navbar'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Container className={classes.container}>
      <div className={classes.header}>
        <div className={classes.logoContainer}>
          <Image
            src="/favicon.png" // Replace with the actual logo source
            alt="Financel Logo"
            width={50} // Set the appropriate width
            height={50} // Set the appropriate height
          />
          <span className={classes.title}>Financel</span>
        </div>
        <Navbar />
      </div>
      <div className={classes.mainContent}>{children}</div>
      <Footer className={classes.footer} />
    </Container>
  )
}

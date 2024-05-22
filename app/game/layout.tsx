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
        <Image
          src="/header.png"
          alt="Financel Logo"
          fill
          sizes="(max-width: 800px) 100vw, 800px"
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
        />
        <Navbar />
      </div>
      <div className={classes.mainContent}>{children}</div>
      <Footer className={classes.footer} />
    </Container>
  )
}

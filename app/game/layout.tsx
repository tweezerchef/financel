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
        <Navbar />
      </div>
      <div className={classes.mainContent}>{children}</div>
      <Footer className={classes.footer} />
    </Container>
  )
}

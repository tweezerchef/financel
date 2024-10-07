import { Container } from '@mantine/core'
import { Footer } from './components/Footer'
import classes from './ui/Layout.module.css'
import { Navbar } from './components/Navbar'

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

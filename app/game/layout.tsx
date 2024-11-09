import { Container } from '@mantine/core'
import { Footer } from './components/layout/Footer'
import classes from './ui/GameLayout.module.css'
import { Navbar } from './components/layout/Navbar'
import { ScoreProvider } from '../context/user/ScoreContext'

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
      <ScoreProvider>
        <div className={classes.mainContent}>{children}</div>
      </ScoreProvider>
      <Footer className={classes.footer} />
    </Container>
  )
}

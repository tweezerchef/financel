import { Header } from './components/Header'
import { Login } from './components/Login'
import classes from './ui/Page.module.css'

export default function Home() {
  return (
    <main className={classes.main}>
      <Header />
      <Login />
    </main>
  )
}

// page.tsx

// Remove 'use client' - make this a Server Component
import { Suspense } from 'react'
import { Header } from './components/Header'
import { LoginWrapper } from './components/LoginWrapper'
import classes from './ui/Page.module.css'

export default function Home() {
  return (
    <main className={classes.main}>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <LoginWrapper />
      </Suspense>
    </main>
  )
}

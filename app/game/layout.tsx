import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Container } from '@mantine/core'
import { Footer } from './components/layout/Footer'

const Navbar = dynamic(
  () => import('./components/layout/Navbar').then((mod) => mod.Navbar),
  {
    ssr: false,
  }
)

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Container
      style={{
        minHeight: '99vh',
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <div style={{ height: 150, position: 'relative' }}>
        <Image
          src="/header.png"
          alt="Financel Logo"
          fill
          sizes="(max-width: 500px) 100vw, 500px"
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
        />
        <Navbar />
      </div>
      {children}
      <Footer />
    </Container>
  )
}

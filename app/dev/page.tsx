import { NextModal } from './components/NextModal'

interface IRmodalProps {
  opened: boolean
  close: () => void
  correct: boolean
  actual: string
  tries?: number
  time?: number
  type: 'Interest Rate' | 'Currency Price' | 'Stock Price'
}
// Mock data object for testing purposes
const mockProps: IRmodalProps = {
  opened: true,
  close: () => console.log('Modal closed'),
  correct: Math.random() < 0.5, // Randomly set to true or false
  actual: '3.25%',
  tries: 3,
  time: 45,
  type: 'Interest Rate',
}

export default function Home() {
  return (
    <main>
      <NextModal {...mockProps} />
    </main>
  )
}

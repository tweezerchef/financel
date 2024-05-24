import { Text, Paper, Group } from '@mantine/core'
import { useSpring, animated } from '@react-spring/web'
import { useEffect, useState } from 'react'
import classes from './ui/GuessDisplay.module.css'

interface GuessDisplayProps {
  guess: string
  result?: { amount: ResponseNumbers; direction: Direction } | null
  createRandomId: () => string
}

export const GuessDisplay: React.FC<GuessDisplayProps> = ({
  guess,
  result,
  createRandomId,
}) => {
  const [flipped, setFlipped] = useState(false)
  const [initialFlip, setInitialFlip] = useState(false)

  useEffect(() => {
    if (!initialFlip && result) {
      setFlipped(true)
      setInitialFlip(true)
    }
  }, [result, initialFlip])

  const { transform } = useSpring({
    transform: flipped ? 'rotateX(360deg)' : 'rotateX(0deg)',
    // opacity: flipped ? 1 : 0,
    config: { duration: 500 },
  })

  const { amount, direction } = result || { amount: 0, direction: 'up' }

  return (
    <Paper
      className={classes.paper}
      shadow="lg"
      radius="xl"
      style={{ textAlign: 'center' }}
    >
      <animated.div style={{ transform }}>
        <Group justify="center" gap="xs">
          <Text>{guess}</Text>
          {result && (
            <Text>
              {Array(amount)
                .fill(null)
                .map(() => (
                  <span key={createRandomId()}>
                    {direction === 'up' ? '↓' : '↑'}
                  </span>
                ))}
            </Text>
          )}
        </Group>
      </animated.div>
    </Paper>
  )
}

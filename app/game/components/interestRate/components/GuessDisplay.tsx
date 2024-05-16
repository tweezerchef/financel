import { Text, Paper, Group } from '@mantine/core'
import { useSpring, animated } from '@react-spring/web'
import classes from './ui/GuessDisplay.module.css'

interface GuessDisplayProps {
  guess: number
  result?: { number: ResponseNumbers; direction: Direction } | null
  flip: boolean
}

export const GuessDisplay: React.FC<GuessDisplayProps> = ({
  guess,
  result,
  flip,
}) => {
  const { transform, opacity } = useSpring({
    reset: flip,
    from: { transform: 'rotateX(0deg)', opacity: 1 },
    to: { transform: 'rotateX(360deg)', opacity: 1 },
    reverse: flip,
  })

  return (
    <Paper
      className={classes.paper}
      shadow="sm"
      radius="xl"
      style={{ textAlign: 'center' }}
    >
      <animated.div style={{ transform, opacity }}>
        <Group justify="center" gap="xs">
          <Text>{guess}</Text>
          {result && (
            <Text>
              {Array(result.number).fill(result.direction === 'up' ? '↑' : '↓')}
            </Text>
          )}
        </Group>
      </animated.div>
    </Paper>
  )
}

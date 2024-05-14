import { Card, Text } from '@mantine/core'
import { useSpring, animated } from '@react-spring/web'

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
    <Card
      shadow="sm"
      radius="md"
      style={{ padding: '20px', textAlign: 'center' }}
    >
      <animated.div style={{ transform, opacity }}>
        <Text>{guess}</Text>
        {result && (
          <Text>
            {Array(result.number).fill(result.direction === 'up' ? '↑' : '↓')}
          </Text>
        )}
      </animated.div>
    </Card>
  )
}

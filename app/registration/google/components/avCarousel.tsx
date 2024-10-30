import { Carousel } from '@mantine/carousel'
import { Avatar } from '@mantine/core'

const avatars = [
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/astronaut.png',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/avatar-36801134.svg',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/bear.png',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/cat.png',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/cool-.png',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/evil-2162179.svg',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/favicon.png',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/favicon.svg',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/girl.png',
]

interface AvCarouselProps {
  onSelectAvatar?: (avatarUrl: string) => void
  selectedAvatar?: string | null
}

export function AvCarousel({
  onSelectAvatar,
  selectedAvatar,
}: AvCarouselProps) {
  return (
    <Carousel
      slideSize="120px"
      height={120}
      slideGap="md"
      controlSize={20}
      loop
      align="center"
      containScroll="trimSnaps"
      styles={{
        root: { width: '100%' },
        controls: {
          padding: 0,
          margin: '0 -10px',
        },
        control: {
          '&[data-inactive="true"]': {
            opacity: 0,
            cursor: 'default',
          },
        },
      }}
    >
      {avatars.map((avatar) => (
        <Carousel.Slide
          key={avatar}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Avatar
            size="xl"
            src={avatar}
            sx={{
              cursor: 'pointer',
              border: avatar === selectedAvatar ? '2px solid blue' : 'none',
            }}
            onClick={() => onSelectAvatar?.(avatar)}
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}

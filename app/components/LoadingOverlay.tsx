import { Center, Loader, Paper, Text } from '@mantine/core'

export function LoadingOverlay() {
  return (
    <Paper
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(2px)' }}
    >
      <Center className="flex flex-col gap-4">
        <Loader size="lg" color="blue" />
        <Text size="lg" c="white" fw={500}>
          Completing authentication...
        </Text>
      </Center>
    </Paper>
  )
}

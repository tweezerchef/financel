import { createTheme, MantineColorsTuple } from '@mantine/core'

const myColor: MantineColorsTuple = [
  '#e0fbff',
  '#cbf2ff',
  '#9ae2ff',
  '#64d2ff',
  '#3cc5fe',
  '#23bcfe',
  '#09b8ff',
  '#00a1e4',
  '#0090cd',
  '#007cb5',
]

const yellow: MantineColorsTuple = [
  '#fffee1',
  '#fffccb',
  '#fff99a',
  '#fff564',
  '#fff238',
  '#fff11d',
  '#fff009',
  '#e3d500',
  '#c9bd00',
  '#ada300',
]

export const theme = createTheme({
  colors: {
    myColor,
    yellow,
  },
  primaryColor: 'myColor',
  primaryShade: 6,
})

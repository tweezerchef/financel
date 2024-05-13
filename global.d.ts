// Updated global.d.ts

type Direction = 'up' | 'down'

enum IRCategory {
  T_30 = 'T_30',
  T_20 = 'T_20',
  T_10 = 'T_10',
  T_5 = 'T_5',
  T_1 = 'T_1',
  T_OVERNIGHT = 'T_OVERNIGHT',
}

type ResponseNumbers = 1 | 2 | 3 | 4 | 5

interface GuessResponse {
  guess: boolean
  number: ResponseNumbers
  direction: Direction
  category: IRCategory
}

type ArrowDeciderReturn = {
  direction: Direction
  amount: ResponseNumbers
}

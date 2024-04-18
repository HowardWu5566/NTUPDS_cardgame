export class Master {
  rank: number
  name: string
  score?: number
  time?: number

  constructor(playerData: {
    rank: number
    name: string
    score?: number
    time?: number
  }) {
    this.rank = playerData.rank
    this.name = playerData.name
    this.score = playerData.score
    this.time = playerData.time
  }

  [key: string]: any /* to fix error 
  Index signature for type 'string' is missing in type 'Master'.ts(2345) */
}

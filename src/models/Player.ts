export class Player {
  rank: number
  name?: string
  score?: number
  time?: number

  constructor(playerData: {
    rank: number
    name: string
    score: number
    time: number
  }) {
    this.rank = playerData.rank
    this.name = playerData.name
    this.score = playerData.score
    this.time = playerData.time
  }
}

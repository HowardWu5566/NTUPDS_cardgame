import { Player } from './Player'
import { getData, getSheet } from '../config/connect'

const RANKING_LENGTH = 10

export class Ranking {
  masters: Player[]

  constructor() {
    this.masters = Array.from({ length: RANKING_LENGTH }, (_, i) => ({
      rank: i + 1
    }))
  }

  async getRanking() {
    try {
      const rows = await getData(Number(process.env.RANKING_SHEET_ID))

      this.masters.forEach((master, i) => {
        master['name'] = rows[i]?.get('name')
        master['score'] = rows[i]?.get('score')
        master['time'] = rows[i]?.get('time')
      })

      return this.masters
    } catch (err) {
      console.error(err)
    }
  }
}

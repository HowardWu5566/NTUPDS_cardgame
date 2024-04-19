import { Master } from './Master'
import { getData, getSheet } from '../config/connect'

export class Ranking {
  private _RANKING_LENGTH: number = 10
  private _masterArr: Master[] = []

  constructor() {}

  public async getRanking() {
    try {
      const rows = await getData(Number(process.env.RANKING_SHEET_ID))

      rows.forEach((row, i) => {
        const name = row.get('name')
        const score = Number(row.get('score'))
        const time = Number(row.get('time'))

        this._masterArr.push(new Master({ rank: i + 1, name, score, time }))
      })

      while (this._masterArr.length < this._RANKING_LENGTH) {
        this._masterArr.push(
          new Master({
            rank: this._masterArr.length + 1,
            name: '虛位以待'
          })
        )
      }

      return this._masterArr
    } catch (err) {
      console.error(err)
    }
  }

  public async getThreshold() {
    try {
      await this.getRanking()
      const threshold: number =
        this._masterArr[this._RANKING_LENGTH - 1]['score'] || 0
      return threshold
    } catch (err) {
      console.error(err)
    }
  }

  public async postRanking(name: string, score: number) {
    try {
      const sheet = await getSheet(Number(process.env.RANKING_SHEET_ID))
      const time = this._getTime()
      name = name ? name : '隱世高人'
      await sheet.addRow({ name, score, time })
    } catch (err) {
      console.error(err)
    }
  }

  public async organize() {
    try {
      const sheet = await getSheet(Number(process.env.RANKING_SHEET_ID))
      const rows = await sheet.getRows()
      const newMasterArr: Master[] = []

      rows.forEach((row, i) => {
        const name = row.get('name')
        const score = Number(row.get('score'))
        const time = Number(row.get('time'))

        newMasterArr.push(new Master({ rank: i + 1, name, score, time }))
      })

      newMasterArr.sort((a, b) => {
        if (a.score === b.score) {
          return (a.time || 0) - (b.time || 0)
        }
        return (b.score || 0) - (a.score || 0)
      })

      if (newMasterArr.length > this._RANKING_LENGTH) {
        newMasterArr.length = this._RANKING_LENGTH
      }

      await sheet.clearRows()
      await sheet.addRows(newMasterArr)
    } catch (err) {
      console.error(err)
    }
  }

  private _getTime() {
    const now = new Date(Date.now())
    const year = now.getFullYear().toString().slice(-2)
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const date = String(now.getDate()).padStart(2, '0')
    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')
    const second = String(now.getSeconds()).padStart(2, '0')

    return Number(year + month + date + hour + minute + second) // e.g. 202415135959
  }
}

import { GoogleSpreadsheetRow } from 'google-spreadsheet'

import { getData } from '../config/connect'
import { Puppet } from './Puppet'
import { Card } from './Card'

export class Game {
  level: string
  puppetNum: number = 0
  cards: Card[] = []

  constructor(level: string) {
    this.level = level
    this.puppetNum = this.convertLvToNum(level)
  }

  convertLvToNum(level: string) {
    const converter: Record<string, number> = {
      easy: 3,
      medium: 6,
      hard: 12
    }
    return converter[level]
  }

  async start() {
    const rawRows = await this.getRawRows()
    const puppetArr = this.getpuppetRows(rawRows)
    this.generateCards(puppetArr)
    this.shuffle()
  }

  async getRawRows() {
    const puppetSheetId: number = Number(process.env.PUPPET_SHEET_ID)
    const rawRows = await getData(puppetSheetId)
    return rawRows
  }

  getpuppetRows(rawRows: GoogleSpreadsheetRow[]) {
    const candidateNum = this.countCandidate(rawRows)
    const pickedIndexArr: number[] = this.pickIndexes(candidateNum)
    const puppetArr: Puppet[] = this.pickPuppets(rawRows, pickedIndexArr)

    return puppetArr
  }

  countCandidate(rawRows: GoogleSpreadsheetRow[]) {
    const counter: Record<string, number> = {
      easy: 0,
      medium: 0,
      hard: 0
    }

    rawRows.forEach((rawRow: GoogleSpreadsheetRow) => {
      counter[rawRow.get('難度')] += 1
    })

    counter['medium'] += counter['easy']
    counter['hard'] += counter['medium']

    return counter[this.level]
  }

  pickIndexes(candidateNum: number) {
    const indexArr: number[] = []
    do {
      const i: number = Math.floor(Math.random() * candidateNum)

      if (!indexArr.includes(i)) {
        indexArr.push(i)
      }
    } while (indexArr.length < this.puppetNum)

    indexArr.sort((a, b) => a - b)

    return indexArr
  }

  pickPuppets(rawRows: GoogleSpreadsheetRow[], pickedIndexArr: number[]) {
    const puppetArr: Puppet[] = []

    pickedIndexArr.forEach(pickedIndex => {
      const id: number = rawRows[pickedIndex].rowNumber
      const name: string = rawRows[pickedIndex].get('木偶')
      const image: string = rawRows[pickedIndex].get('照片')
      const puppet: Puppet = new Puppet(id, name, image)

      puppetArr.push(puppet)
    })

    return puppetArr
  }

  generateCards(puppetArr: Puppet[]) {
    for (let i = 0; i < puppetArr.length; i++) {
      const card1 = new Card(puppetArr[i].id, { name: puppetArr[i].name })
      const card2 = new Card(puppetArr[i].id, { image: puppetArr[i].image })

      this.cards.push(card1)
      this.cards.push(card2)
    }
  }

  shuffle() {
    let currIndex: number = this.cards.length
    let randIndex: number

    while (currIndex !== 0) {
      randIndex = Math.floor(Math.random() * currIndex)
      currIndex -= 1

      // swap
      ;[this.cards[currIndex], this.cards[randIndex]] = [
        this.cards[randIndex],
        this.cards[currIndex]
      ]
    }
  }
}

import { GoogleSpreadsheetRow } from 'google-spreadsheet'

import { getData, rawPuppetRows } from '../config/connect'
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

  convertLvToNum(level: string): number {
    const converter: Record<string, number> = {
      easy: 3,
      medium: 6,
      hard: 12
    }
    return converter[level]
  }

  async start() {
    const puppetArr = this.getpuppetRows(rawPuppetRows)
    this.generateCards(puppetArr)
    this.shuffle()
  }

  getpuppetRows(rawRows: GoogleSpreadsheetRow[]): Puppet[] {
    const candidateNum = this.countCandidate(rawRows)
    const pickedIndexArr: number[] = this.pickIndexes(candidateNum)
    const puppetArr: Puppet[] = this.pickPuppets(rawRows, pickedIndexArr)

    return puppetArr
  }

  countCandidate(rawRows: GoogleSpreadsheetRow[]): number {
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

  pickIndexes(candidateNum: number): number[] {
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

  pickPuppets(
    rawRows: GoogleSpreadsheetRow[],
    pickedIndexArr: number[]
  ): Puppet[] {
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
    const minId: number = puppetArr[0].id

    for (let i = 0; i < puppetArr.length; i++) {
      const randNum1: number = this.generateRandNum(puppetArr[i].id, minId)
      const randNum2: number = this.generateRandNum(puppetArr[i].id, minId)

      const card1 = new Card(randNum1, { name: puppetArr[i].name })
      const card2 = new Card(randNum2, { image: puppetArr[i].image })

      this.cards.push(card1)
      this.cards.push(card2)
    }

    this.cards[0] = new Card(puppetArr[0].id, { name: puppetArr[0].name })
  }

  generateRandNum(id: number, minId: number): number {
    const primeArr = [
      // length = 25
      101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
      179, 181, 191, 193, 197, 199, 211, 223, 227, 229
    ]
    const randTimes = Math.floor(Math.random() * 10 + 1)
    return id * (primeArr[minId] * randTimes + 1)
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

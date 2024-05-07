export class Card {
  randNum: number
  front: { name: string } | { image: string }

  constructor(randNum: number, front: { name: string } | { image: string }) {
    this.randNum = randNum
    this.front = front
  }
}

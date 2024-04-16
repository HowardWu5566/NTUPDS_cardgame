export class Card {
  id: number
  front: { name: string } | { image: string }

  constructor(id: number, front: { name: string } | { image: string }) {
    this.id = id
    this.front = front
  }
}

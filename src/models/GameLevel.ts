import { Game } from './Game'

export type GameLevel = 'easy' | 'medium' | 'hard'

export class EasyGame extends Game {
  level: string = 'easy'
  puppetNum: number = 3
  constructor() {
    super()
    this.init()
  }
}

export class MediumGame extends Game {
  level: string = 'medium'
  puppetNum: number = 6
  constructor() {
    super()
    this.init()
  }
}

export class HardGame extends Game {
  level: string = 'hard'
  puppetNum: number = 12
  constructor() {
    super()
    this.init()
  }
}

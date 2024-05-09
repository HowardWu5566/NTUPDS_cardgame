export class Gametime {
  private start: number = 0
  private end: number = 0
  private elapsed: number = 0
  private _LIMIT: number = 90000

  constructor() {}

  public startTimer() {
    this.start = Date.now()
  }

  public endTimer() {
    this.end = Date.now()
    this.elapsed = this.end - this.start
  }

  public getElapsedTime() {
    return this.elapsed
  }

  public isTimesUp() {
    return this.elapsed > this._LIMIT
  }
}

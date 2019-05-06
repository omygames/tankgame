export class Velocity2d {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  reset() {
    this.x = 0
    this.y = 0
  }
}

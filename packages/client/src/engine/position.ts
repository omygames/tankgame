export class Position2d {
  static getDistance(pos1: Position2d, pos2: Position2d) {
    return ((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2) ** 0.5
  }

  x: number
  y: number
  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }

  assign(position: Position2d) {
    this.x = position.x
    this.y = position.y
    return this
  }
}

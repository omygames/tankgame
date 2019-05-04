import { Position2d } from './position'
import { Velocity2d } from './velocity'
import { Rotation2d } from './rotation'

export class GameObject {
  position: Position2d
  rotation: Rotation2d
  velocity: Velocity2d

  constructor() {
    this.position = new Position2d(0, 0)
    this.velocity = new Velocity2d(0, 0)
    this.rotation = new Rotation2d(0)
  }

  draw() {
    // impl in sub class
  }

  serialize() {
    return this
  }
}

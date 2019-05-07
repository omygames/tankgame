import { Position2d } from './position'
import { Velocity2d } from './velocity'
import { Rotation2d } from './rotation'
import { RigidBody } from './rigid_body'

export class GameObject {
  position: Position2d
  rotation: Rotation2d
  velocity: Velocity2d
  toBeDestroyed: boolean
  rigidBody?: RigidBody

  constructor() {
    this.position = new Position2d(0, 0)
    this.velocity = new Velocity2d(0, 0)
    this.rotation = new Rotation2d(0)
    this.toBeDestroyed = false
  }

  onCollision(obj: GameObject) {
    // impl in sub class
  }

  draw() {
    // impl in sub class
  }

  update(frameTick?: number) {
    // 逻辑帧会执行, 且执行顺序先于 tick
  }

  tick(frameTick: number) {
    this.position.x += (this.velocity.x * frameTick) / 1000
    this.position.y += (this.velocity.y * frameTick) / 1000
  }

  serialize() {
    return this
  }
}

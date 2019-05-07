import { Position2d } from './position'
import { GameObject } from './game_object'

// 目前所有的刚体都为圆，每个圆的大小也就是半径可能不同
// 这样计算就会非常简便
export class RigidBody {
  size: number
  position: Position2d
  onCollide: (obj: GameObject) => void

  static isCollided(rig1: RigidBody, rig2: RigidBody) {
    const dis = Position2d.getDistance(rig1.position, rig2.position)
    return dis < rig1.size + rig2.size
  }

  constructor(size: number, position: Position2d) {
    this.size = size
    this.position = position
  }
}

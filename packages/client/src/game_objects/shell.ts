import { GraphicsContext } from '../engine/graphics_context'
import { GameObject } from '../engine/game_object'
import { Tank } from './tank'
import { Position2d } from '../engine/position'
import { RigidBody } from '../engine/rigid_body'

export class Shell extends GameObject {
  from: Tank
  rigidBody: RigidBody
  damage: number
}

export class SimpleBasicShell extends Shell {
  static maxSpeed = 700
  static range = 1000
  static size = 2

  graphicsContext: GraphicsContext
  color: string
  startPosition: Position2d

  constructor(graphicsContext: GraphicsContext, startPosition: Position2d) {
    super()
    this.damage = 20
    this.color = 'red'
    this.graphicsContext = graphicsContext
    this.startPosition = startPosition
    this.position.assign(this.startPosition)
    this.rigidBody = new RigidBody(SimpleBasicShell.size, this.position)
  }

  update() {
    const flewDis = Position2d.getDistance(this.position, this.startPosition)
    if (flewDis > SimpleBasicShell.range) {
      this.toBeDestroyed = true
    }
  }

  draw() {
    const ctx = this.graphicsContext.ctx
    ctx.fillStyle = this.color
    ctx.fillRect(
      this.position.x,
      this.position.y,
      SimpleBasicShell.size * 2,
      SimpleBasicShell.size * 2
    )
  }
}

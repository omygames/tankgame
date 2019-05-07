import { GraphicsContext } from '../engine/graphics_context'
import { GameObject } from '../engine/game_object'
import { Tank } from './tank'
import { Position2d } from '../engine/position'

export class Shell extends GameObject {
  from: Tank
}

export class SimpleBasicShell extends Shell {
  static maxSpeed = 700
  static range = 1000

  graphicsContext: GraphicsContext
  color: string
  startPosition: Position2d

  constructor(graphicsContext: GraphicsContext, startPosition: Position2d) {
    super()
    this.color = 'red'
    this.graphicsContext = graphicsContext
    this.startPosition = startPosition
    this.position.assign(this.startPosition)
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
    ctx.fillRect(this.position.x, this.position.y, 3, 3)
  }
}

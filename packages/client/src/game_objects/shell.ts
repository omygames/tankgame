import { GraphicsContext } from '../engine/graphics_context'
import { GameObject } from '../engine/game_object'
import { Tank } from './tank'

export class Shell extends GameObject {
  from: Tank
}

export class SimpleBasicShell extends Shell {
  static maxSpeed = 700

  graphicsContext: GraphicsContext
  color: string

  constructor(graphicsContext: GraphicsContext) {
    super()
    this.color = 'red'
    this.graphicsContext = graphicsContext
  }

  draw() {
    const ctx = this.graphicsContext.ctx
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, 3, 3)
  }
}

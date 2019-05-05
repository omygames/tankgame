import { GraphicsContext } from '../engine/graphics_context'
import { GameObject } from '../engine/game_object'

export class Tank extends GameObject {
  graphicsContext: GraphicsContext

  constructor(graphicsContext: GraphicsContext) {
    super()
    this.graphicsContext = graphicsContext
  }

  draw() {
    const ctx = this.graphicsContext.ctx
    ctx.save()
    ctx.fillStyle = 'red'
    const { x, y } = this.position
    const fillColor = 'red'
    ctx.fillStyle = fillColor
    ctx.fillRect(x, y - 1, 5, 22)
    ctx.fillRect(x + 15, y - 1, 5, 22)
    ctx.fillRect(x + 6, y, 8, 20)
    ctx.fillStyle = 'blue'
    ctx.beginPath()
    ctx.arc(x + 10, y + 10, 3, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'orange'
    ctx.lineWidth = 2
    ctx.moveTo(x + 10, y + 10)
    ctx.lineTo(x + 10, y - 10)
    ctx.stroke()
    ctx.restore()
  }
}

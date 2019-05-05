import { GraphicsContext } from '../engine/graphics_context'
import { GameObject } from '../engine/game_object'
import { Rotation2d } from '../engine/rotation'

export class Tank extends GameObject {
  graphicsContext: GraphicsContext
  wheelRotation: Rotation2d

  constructor(graphicsContext: GraphicsContext) {
    super()
    this.graphicsContext = graphicsContext
    this.wheelRotation = new Rotation2d(0)
  }

  draw() {
    const ctx = this.graphicsContext.ctx
    const { x, y } = this.position
    ctx.save()

    ctx.translate(x + 10, y + 11)
    ctx.rotate((this.wheelRotation.rotation * Math.PI) / 180)
    ctx.translate(-(x + 10), -(y + 11))

    ctx.fillStyle = '#300ccf'
    ctx.fillRect(x, y - 1, 5, 22)
    ctx.fillRect(x + 15, y - 1, 5, 22)
    ctx.fillRect(x + 6, y, 8, 20)
    ctx.rotate(-(45 * Math.PI) / 180)
    ctx.restore()
    ctx.save()

    ctx.strokeStyle = '#085a91'
    ctx.lineWidth = 3
    ctx.moveTo(x + 10, y + 5)
    ctx.lineTo(x + 10, y - 5)
    ctx.stroke()

    ctx.fillStyle = '#0c81cf'
    ctx.beginPath()
    ctx.arc(x + 10, y + 10, 3, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}

import { GraphicsContext } from '../engine/graphics_context'
import { GameObject } from '../engine/game_object'
import { Rotation2d } from '../engine/rotation'
const debug = require('debug')('tankgame:tank')

export class Tank extends GameObject {
  graphicsContext: GraphicsContext
  // 弧度
  wheelRotation: Rotation2d
  direction: number
  rotationSpeed: number

  static maxSpeed = 100 // px/s
  static maxRotationSpeed = Math.PI / 4 // rad/s 正值为顺时针

  constructor(graphicsContext: GraphicsContext) {
    super()
    this.graphicsContext = graphicsContext
    this.wheelRotation = new Rotation2d(0)
    this.rotationSpeed = 0
  }

  tick(frameTick) {
    this.position.x += (this.velocity.x * frameTick) / 1000
    this.position.y += (this.velocity.y * frameTick) / 1000
    this.wheelRotation.rotation += (this.rotationSpeed * frameTick) / 1000
  }

  goForward() {
    this.velocity.y = Tank.maxSpeed * Math.sin(this.wheelRotation.rotation)
    this.velocity.x = Tank.maxSpeed * Math.cos(this.wheelRotation.rotation)
  }

  goBackward() {
    this.velocity.y = -Tank.maxSpeed * Math.sin(this.wheelRotation.rotation)
    this.velocity.x = -Tank.maxSpeed * Math.cos(this.wheelRotation.rotation)
  }

  stopMoving() {
    this.velocity.reset()
  }

  turnLef() {
    this.rotationSpeed = -Tank.maxRotationSpeed
  }

  turnRight() {
    this.rotationSpeed = Tank.maxRotationSpeed
  }

  stopTurning() {
    this.rotationSpeed = 0
  }

  draw() {
    const ctx = this.graphicsContext.ctx
    const { x, y } = this.position
    ctx.save()

    ctx.translate(x + 10, y + 11)
    ctx.rotate(this.wheelRotation.rotation)
    ctx.translate(-(x + 10), -(y + 11))

    ctx.fillStyle = '#300ccf'
    ctx.fillRect(x, y - 1, 5, 22)
    ctx.fillRect(x + 15, y - 1, 5, 22)
    ctx.fillRect(x + 6, y, 8, 20)
    // ctx.rotate(-(45 * Math.PI) / 180)
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

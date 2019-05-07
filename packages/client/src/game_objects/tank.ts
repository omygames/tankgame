import { GraphicsContext } from '../engine/graphics_context'
import { GameObject } from '../engine/game_object'
import { Rotation2d } from '../engine/rotation'
import { Shell, SimpleBasicShell } from './shell'
import { RigidBody } from '../engine/rigid_body'
const debug = require('debug')('tankgame:tank')

export class Tank extends GameObject {
  graphicsContext: GraphicsContext
  // 弧度
  wheelRotation: Rotation2d
  direction: number
  rotationSpeed: number
  // TODO: 会不会循环引用
  onHitByShell?: (shell: Shell) => void
  rigidBody: RigidBody
  health: number

  static maxSpeed = 100 // px/s
  static maxRotationSpeed = Math.PI / 4 // rad/s 正值为顺时针

  constructor(graphicsContext: GraphicsContext) {
    super()
    this.graphicsContext = graphicsContext
    this.wheelRotation = new Rotation2d(0)
    this.rotationSpeed = 0
    this.direction = 0
    this.health = 100
    // rigidBody 和 tank 用了同一个 position 实例，不知道会不会产生问题
    this.rigidBody = new RigidBody(11, this.position)
    this.rigidBody.onCollide = obj => {
      if (obj instanceof SimpleBasicShell && obj.from !== this) {
        obj.toBeDestroyed = true
        debug('collided', obj)
        if (this.onHitByShell) {
          this.onHitByShell(obj)
        }
      }
    }
  }

  takeDamage(damage: number) {
    this.health -= damage
    if (this.health <= 0) {
      this.toBeDestroyed = true
    }
  }

  tick(frameTick) {
    this.velocity.y =
      Tank.maxSpeed * Math.sin(this.wheelRotation.rotation) * this.direction
    this.velocity.x =
      Tank.maxSpeed * Math.cos(this.wheelRotation.rotation) * this.direction

    this.position.x += (this.velocity.x * frameTick) / 1000
    this.position.y += (this.velocity.y * frameTick) / 1000
    this.wheelRotation.rotation += (this.rotationSpeed * frameTick) / 1000
  }

  goForward() {
    this.direction = 1
  }

  goBackward() {
    this.direction = -1
  }

  stopMoving() {
    this.direction = 0
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
    // TODO: 修复中心偏移的问题，目前 rigidBody 以 position 为圆心
    // 中心偏移 rigidBody 也会偏移
    const ctx = this.graphicsContext.ctx
    const { x, y } = this.position
    ctx.save()
    ctx.translate(x + 10, y + 11)
    ctx.rotate(this.wheelRotation.rotation + Math.PI / 2)
    ctx.translate(-(x + 10), -(y + 11))

    ctx.fillStyle = '#300ccf'
    ctx.fillRect(x, y - 1, 5, 22)
    ctx.fillRect(x + 15, y - 1, 5, 22)
    ctx.fillRect(x + 6, y, 8, 20)
    ctx.strokeStyle = '#085a91'
    ctx.lineWidth = 3
    ctx.moveTo(x + 10, y + 5)
    ctx.lineTo(x + 10, y - 5)
    ctx.stroke()
    ctx.restore()

    ctx.save()
    ctx.fillStyle = '#0c81cf'
    ctx.beginPath()
    ctx.arc(x + 10, y + 10, 3, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    this.graphicsContext.drawText({
      text: `${this.health}`,
      position: this.position,
    })
  }
}

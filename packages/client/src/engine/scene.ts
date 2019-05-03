import { GameObject } from './game_object'
import { Graphics } from './graphics'

export class Scene {
  gameObjects: GameObject[]
  graphics: Graphics

  constructor(graphics: Graphics) {
    this.graphics = graphics
    this.gameObjects = []
  }

  private resetBg() {
    const ctx = this.graphics.ctx
    ctx.save()
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, this.graphics.canvas.width, this.graphics.canvas.height)
    ctx.restore()
  }

  addObject(gameObject: GameObject) {
    this.gameObjects.push(gameObject)
  }

  update() {
    this.resetBg()
    this.gameObjects.forEach(gObj => {
      gObj.position.x += gObj.velocity.x
      gObj.position.y += gObj.velocity.y
      gObj.draw()
    })
  }
}

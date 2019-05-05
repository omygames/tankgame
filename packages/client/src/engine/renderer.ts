import { Scene } from './scene'
import { GraphicsContext } from './graphics_context'

export class Renderer {
  scene: Scene
  graphics: GraphicsContext

  constructor(graphics: GraphicsContext, scene: Scene) {
    this.graphics = graphics
    this.scene = scene
  }

  private resetBg() {
    const ctx = this.graphics.ctx
    ctx.save()
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, this.graphics.canvas.width, this.graphics.canvas.height)
    ctx.restore()
  }

  render() {
    this.resetBg()
    this.scene.gameObjects.forEach(gObj => {
      if (gObj.draw) {
        gObj.draw()
      }
    })
  }
}

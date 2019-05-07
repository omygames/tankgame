import { Position2d } from './position'

export class GraphicsContext {
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  get ctx() {
    return this.canvas.getContext('2d')
  }

  drawText(config: { text: string; position: Position2d }) {
    const ctx = this.ctx
    ctx.save()
    ctx.fillStyle = 'red'
    ctx.font = '12px sans-serif'
    ctx.fillText(config.text, config.position.x, config.position.y)
    ctx.restore()
  }
}

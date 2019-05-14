import { Position2d } from './position'

export class GraphicsContext {
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  get ctx() {
    return this.canvas.getContext('2d')
  }

  drawText(config: { text: string; position: Position2d; textAlign: CanvasTextAlign; offset?: any }) {
    const ctx = this.ctx
    const x = config.position.x + (config.offset ? config.offset.x : 0)
    const y = config.position.y + (config.offset ? config.offset.y : 0)
    ctx.save()
    ctx.fillStyle = 'red'
    ctx.textAlign = config.textAlign
    ctx.font = '12px sans-serif'
    ctx.fillText(config.text, x, y)
    ctx.restore()
  }
}

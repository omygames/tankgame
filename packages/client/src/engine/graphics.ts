export class Graphics {
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  get ctx() {
    return this.canvas.getContext('2d')
  }
}

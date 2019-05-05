import { Scene } from './scene'

export class LogicFrame {
  scene: Scene
  frameTick: number

  constructor(scene: Scene) {
    this.scene = scene
    this.frameTick = 1000 / 60
  }

  tick() {
    this.scene.gameObjects.forEach(gObj => {
      gObj.position.x += (gObj.velocity.x * this.frameTick) / 1000
      gObj.position.y += (gObj.velocity.y * this.frameTick) / 1000
    })
  }
}

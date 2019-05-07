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
      if (typeof gObj.tick === 'function') {
        gObj.tick(this.frameTick)
      }
    })
  }
}

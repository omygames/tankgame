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
      if (gObj.toBeDestroyed) {
        this.scene.removeObject(gObj)
      }
      gObj.update(this.frameTick)
      gObj.tick(this.frameTick)
    })
  }
}

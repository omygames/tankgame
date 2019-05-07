import { Scene } from './scene'
import { Position2d } from './position'
import { RigidBody } from './rigid_body'

export class LogicFrame {
  scene: Scene
  frameTick: number

  constructor(scene: Scene) {
    this.scene = scene
    this.frameTick = 1000 / 60
  }

  tick() {
    this.scene.gameObjects.forEach((gObj, j) => {
      if (gObj.toBeDestroyed) {
        this.scene.removeObject(gObj)
        return
      }

      if (gObj.rigidBody) {
        for (let k = j + 1; k < this.scene.gameObjects.length; k++) {
          const targetObj = this.scene.gameObjects[k]
          if (targetObj.rigidBody) {
            if (RigidBody.isCollided(gObj.rigidBody, targetObj.rigidBody)) {
              if (gObj.rigidBody.onCollide) {
                gObj.rigidBody.onCollide(targetObj)
              }
              if (targetObj.rigidBody.onCollide) {
                targetObj.rigidBody.onCollide(gObj)
              }
            }
          }
        }
      }

      gObj.update(this.frameTick)
      gObj.tick(this.frameTick)
    })
  }
}

import { GameObject } from './game_object'
import { GraphicsContext } from './graphics_context'

export class Scene {
  gameObjects: GameObject[]
  graphicsContext: GraphicsContext

  constructor(graphicsContext: GraphicsContext) {
    this.graphicsContext = graphicsContext
    this.gameObjects = []
  }

  addObject(gameObject: GameObject) {
    this.gameObjects.push(gameObject)
  }

  removeObject(gameObject: GameObject) {
    this.gameObjects = this.gameObjects.filter(obj => obj !== gameObject)
  }
}

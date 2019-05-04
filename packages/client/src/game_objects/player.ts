import { Tank } from './tank'

export class Player {
  name: string
  tank?: Tank
  id: string

  constructor(id: string, name?: string) {
    this.id = id
    this.name = name || `Player-${id}`
  }
}

import _ from 'lodash'
import { Snake } from '../components/SnakeGame/gameObjects'

class Game {
  constructor() {
    this.players = {}
    this.context = {}
    this._self = null
  }

  set self(id) {
    this._self = id
  }

  get self() {
    return this.players[this._self]
  }

  findPlayerById(id) {
    return this.players[id]
  }

  addPlayer(id, player) {
    this.players[id] = player
    if (this.onPlayerNumChange) this.onPlayerNumChange(this.players)
    return player
  }

  updateContext(context) {
    this.context = context
  }

  updatePlayer(id, player) {
    const game = _.mapValues(player.game, object => {
      // TODO
      if (object.type === 'snake') {
        return new Snake(object)
      }
      return object
    })
    this.players[id] = {
      ...player,
      game
    }
    return this.players[id]
  }

  removePlayer(id) {
    delete this.players[id]
    if (this.onPlayerNumChange) this.onPlayerNumChange(this.players)
  }

  get size() {
    return Object.keys(this.players).length
  }

  on(evt, cb) {
    switch (evt) {
      case 'player_num_change':
        this.onPlayerNumChange = cb
        break;
    
      default:
        break;
    }
  }

  get objects() {
    const objects = []
    _.forEach(this.players, player => {
      _.forEach(player.game || [], object => {
        objects.push(object)
      })
    })
    _.forEach(this.context, object => {
      // TODO
      if (object && object.type === 'apple') {
        objects.push(object)
      }
    })
    return objects
  }
}

export default Game

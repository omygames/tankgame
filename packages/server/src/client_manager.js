export class ClientManager {
  constructor() {
    this._length = 0
    this._innerCount = 0
    this.wm = new WeakMap()
  }

  get length() {
    return this._length
  }

  set length(v) {
    this._length = v
    if (this.onCountChangeCb) {
      this.onCountChangeCb(v)
    }
  }

  get(key) {
    return this.wm.get(key)
  }

  add(socket, playerInfo) {
    this._innerCount++
    const player = Object.assign({}, playerInfo, {
      id: this._innerCount,
      connectedAt: new Date(),
    })
    this.wm.set(socket, player)
    this.length++
    return player
  }

  set(k, v) {
    this.wm.set(k, v)
  }

  delete(key) {
    this.wm.delete(key)
    this.length--
  }

  onCountChange(cb) {
    this.onCountChangeCb = cb
  }
}

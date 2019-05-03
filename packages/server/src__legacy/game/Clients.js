class Clients {
  constructor() {
    this.length = 0
    this._innerCount = 0
    this.wm = new WeakMap()
  }

  get(key) {
    return this.wm.get(key)
  }

  add(k, v) {
    this._innerCount++
    const data = Object.assign({}, v, {
      id: this._innerCount,
      connectedAt: new Date()
    })
    this.wm.set(k, data)
    this.length++
    if (this.onCountChangeCb) this.onCountChangeCb(this.length)
    return data
  }

  set(k, v) {
    this.wm.set(k, v)
  }

  delete(key) {
    this.wm.delete(key)
    this.length--
    if (this.onCountChangeCb) this.onCountChangeCb(this.length)
  }

  onCountChange(cb) {
    this.onCountChangeCb = cb
  }
}

module.exports = Clients

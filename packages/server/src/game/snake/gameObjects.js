// @ts-check
class Apple {
  constructor({ x = null, y = null, scene = {} } = {}) {
    this.x = x === null ? Math.floor(Math.random() * scene.width) : x
    this.y = y === null ? Math.floor(Math.random() * scene.height) : y
    this.scene = scene
    this.type = 'apple'
    this.color = 'red'
  }

  update() {
    this.x = Math.floor(Math.random() * this.scene.width)
    this.y = Math.floor(Math.random() * this.scene.height)
  }
}

exports.Apple = Apple

class Snake {
  constructor({
    x = null,
    y = null,
    vx = 0,
    vy = 0,
    scene = {},
    tail = 5,
    trail = [],
    alive = true
  } = {}) {
    this.x = x === null ? Math.floor(Math.random() * scene.width) : x
    this.y = y === null ? Math.floor(Math.random() * scene.height) : y
    this.vx = vx
    this.vy = vy
    this.alive = alive
    this.tail = tail
    this.trail = trail
    this.scene = scene
    this.type = 'snake'
    this.color = 'green'
  }

  get objects() {
    return this.trail.map(item => {
      return {
        ...item,
        color: this.color
      }
    })
  }

  turn(direction) {
    switch (direction) {
      case 'left':
        this.vx = -1
        this.vy = 0
        break
      case 'up':
        this.vx = 0
        this.vy = -1
        break
      case 'right':
        this.vx = 1
        this.vy = 0
        break
      case 'down':
        this.vx = 0
        this.vy = 1
        break
      default:
        break
    }
  }

  eatApple() {
    this.tail++
  }

  move() {
    this.x += this.vx
    this.y += this.vy
    if (this.x < 0) {
      this.x = this.scene.width - 1
    }
    if (this.x > this.scene.width - 1) {
      this.x = 0
    }
    if (this.y < 0) {
      this.y = this.scene.height - 1
    }
    if (this.y > this.scene.height - 1) {
      this.y = 0
    }
    for (let i = 0; i < this.trail.length; i++) {
      if (this.trail[i].x === this.x && this.trail[i].y === this.y) {
        this.tail = 5
      }
    }
    this.trail.push({ x: this.x, y: this.y })
    while (this.trail.length > this.tail) {
      this.trail.shift()
    }
  }
}

exports.Snake = Snake

class Scene {
  constructor({
    width,
    height,
    scale,
    ctx
  }) {
    this.width = width
    this.height = height
    this.scale = scale
    this.ctx = ctx
    this.objects = []
    this.type = 'scene'
  }

  add(object) {
    this.objects.push(object)
    return object
  }

  remove(object) {
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i] === object) {
        delete this.objects[i]
        break
      }
    }
  }
}

exports.Scene = Scene

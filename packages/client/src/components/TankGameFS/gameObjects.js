import _ from 'lodash'

const playerSpeed = 10
const bulletSpeed = 3

class GameObject {
  constructor() {
    this.inactive = false
  }

  next = () => { }
  render = () => { }
}

export class Tank extends GameObject {
  constructor({ x, y, color, color2, hp = 100 }) {
    super()
    this.x = x
    this.y = y
    this.color = color
    this.color2 = color2
    this.direction = parseInt(Math.random() * 4, 10)
    this.bullets = []
    this.hp = hp
    this._originalColor = this.color
    this._blink = []
  }

  next = () => {
    this.bullets = this.bullets.filter(b => {
      return !b.inactive
    })
    const blinkIndex = this._blink.shift()
    if (blinkIndex && blinkIndex % 4 === 0) {
      this.color= 'black'
    } else {
      this.color = this._originalColor
    }
  }

  move = (direction) => {
    switch (direction) {
      case 'up':
        this.up()
        break
      case 'down':
        this.down()
        break
      case 'left':
        this.left()
        break
      case 'right':
        this.right()
        break
      default:
        break
    }
  }

  up = () => {
    this.y -= playerSpeed
    this.direction = 0
  }

  down = () => {
    this.y += playerSpeed
    this.direction = 1
  }

  left = () => {
    this.x -= playerSpeed
    this.direction = 2
  }

  right = () => {
    this.x += playerSpeed
    this.direction = 3
  }

  injured = () => {
    this.hp -= 30
    this._blink = _.times(30)
    if (this.hp <= 0) {
      this.inactive = true
    }
  }

  shoot = () => {
    let bullet
    switch (this.direction) {
      case 0:
        bullet = new Bullet(this.x + 9, this.y, this.direction, this)
        break
      case 1:
        bullet = new Bullet(this.x + 9, this.y + 22, this.direction, this)
        break
      case 2:
        bullet = new Bullet(this.x, this.y + 9, this.direction, this)
        break
      case 3:
        bullet = new Bullet(this.x + 22, this.y + 9, this.direction, this)
        break
      default:
        break
    }
    this.bullets.push(bullet)
  }

  get objects() {
    return this.bullets.concat(this)
  }

  render = (scene) => {
    const entity = this
    const ctx = scene.ctx
    switch (entity.direction) {
      case 0: // up
      case 1: // down
        ctx.fillStyle = entity.color
        ctx.fillRect(entity.x, entity.y - 1, 5, 22)
        ctx.fillRect(entity.x + 15, entity.y - 1, 5, 22)
        ctx.fillRect(entity.x + 6, entity.y, 8, 20)
        ctx.fillStyle = entity.color
        ctx.beginPath()
        ctx.arc(entity.x + 10, entity.y + 10, 3, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = entity.color2
        ctx.lineWidth = 2
        ctx.moveTo(entity.x + 10, entity.y + 10)
        if (entity.direction === 0) {
          ctx.lineTo(entity.x + 10, entity.y - 10)
        } else if (entity.direction === 1) {
          ctx.lineTo(entity.x + 10, entity.y + 30)
        }
        ctx.stroke()
        break
      case 2: // left
      case 3: // right
        ctx.fillStyle = entity.color
        ctx.fillRect(entity.x - 1, entity.y, 22, 5)
        ctx.fillRect(entity.x - 1, entity.y + 15, 22, 5)
        ctx.fillRect(entity.x, entity.y + 6, 20, 8)
        ctx.fillStyle = entity.color
        ctx.beginPath()
        ctx.arc(entity.x + 10, entity.y + 10, 3, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = entity.color2
        ctx.lineWidth = 2
        ctx.moveTo(entity.x + 10, entity.y + 10)
        if (entity.direction === 2) {
          ctx.lineTo(entity.x - 10, entity.y + 10)
        } else if (entity.direction === 3) {
          ctx.lineTo(entity.x + 30, entity.y + 10)
        }
        ctx.stroke()
        break
      default:
        break
    }
  }
}

export class Bullet extends GameObject {
  constructor(x, y, direction, entity) {
    super()
    this.x = x
    this.y = y
    this.direction = direction
    this.entity = entity
  }

  next = () => {
    if (this.inactive) return
    switch (this.direction) { // up0 down1 left2 right3
      case 0:
        this.y -= bulletSpeed
        break
      case 1:
        this.y += bulletSpeed
        break
      case 2:
        this.x -= bulletSpeed
        break
      case 3:
        this.x += bulletSpeed
        break
      default:
        break
    }

    // TODO
    if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
      this.inactive = true
    }
  }

  render = (scene) => {
    const ctx = scene.ctx
    ctx.fillStyle = this.color || 'red'
    ctx.fillRect(this.x, this.y, 2, 2)
  }
}

export class Scene extends GameObject {
  constructor({
    width,
    height,
    scale = 1,
    ctx
  }) {
    super()
    this.width = width
    this.height = height
    this.scale = scale
    this.ctx = ctx
    this.objects = []
    this.type = 'scene'
  }

  add = (object) => {
    this.objects.push(object)
    return object
  }

  remove = (object) => {
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i] === object) {
        delete this.objects[i]
        break
      }
    }
  }

  render = (objects) => {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.width * this.scale, this.height * this.scale)
    const toRender = objects.concat(this.objects)

    toRender.forEach(obj => {
      (obj.objects ? obj.objects : [obj]).forEach(object => {
        if (object.render && !object.inactive) {
          object.render(this)
        }
      })
    })
  }
}

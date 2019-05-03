class Player {
  constructor(params) {
    this.id = params.uuid
    this.x = params.x
    this.y = params.y
    this.color = params.color
    this.color2 = params.color2
    this.direction = parseInt(Math.random() * 4, 10)
    this.bullets = []
    this.alive = true
    this.kill = 0
    this.death = 0
    this.playerSpeed = 3
    this.bulletSpeed = 8
  }
  up() {
    this.y -= this.playerSpeed
    this.direction = 0
  }
  down() {
    this.y += this.playerSpeed
    this.direction = 1
  }
  left() {
    this.x -= this.playerSpeed
    this.direction = 2
  }
  right() {
    this.x += this.playerSpeed
    this.direction = 3
  }
  shoot() {
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
    this.bullets = this.bullets.filter(item => {
      return item.alive
    })
    this.bullets.push(bullet)
  }
}

exports.ShootPlayer = Player

class Bullet {
  constructor(params) {
    this.x = params.x
    this.y = params.y
    this.direction = params.direction
    this.alive = true
    this.entity = params.entity
    this.bulletSpeed = params.bulletSpeed
  }
  run() {
    if (!this.alive) return
    switch (this.direction) { // up0 down1 left2 right3
      case 0:
        this.y -= this.bulletSpeed
        break
      case 1:
        this.y += this.bulletSpeed
        break
      case 2:
        this.x -= this.bulletSpeed
        break
      case 3:
        this.x += this.bulletSpeed
        break
      default:
        break
    }

    if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
      this.alive = false
    }
  }
}


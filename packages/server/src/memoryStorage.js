const Clients = require('./game/Clients')

class SnakeGame {}

const snakeGame = new SnakeGame()

exports.snakeGame = snakeGame

const shootGame = {}

exports.shootGame = shootGame

const connectedClients = new Clients()

exports.connectedClients = connectedClients

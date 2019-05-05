interface Action {
  type: string
  payload: any
  meta?: {
    timestamp: number
    playerId: string
  }
}

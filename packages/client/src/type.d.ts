interface Action {
  type: string
  payload: any
  meta?: {
    playerId?: string
    timestamp?: number
    frameIndex?: number
  }
}

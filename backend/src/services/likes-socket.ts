import type { Server } from 'socket.io'

let io: Server | undefined

export type LikesChangedPayload = {
  vacationId: number
  likesCount: number
}

export function setLikesSocket(server: Server) {
  io = server
}

// Only shared data is broadcast. User-specific like state stays private to each browser session.
export function emitLikesChanged(payload: LikesChangedPayload) {
  io?.emit('likes-changed', payload)
}

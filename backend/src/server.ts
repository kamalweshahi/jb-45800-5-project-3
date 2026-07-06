import http from 'http'
import { Server } from 'socket.io'
import app, { init } from './app'
import config from './config'
import { setLikesSocket } from './services/likes-socket'

async function start() {
  await init()

  const httpServer = http.createServer(app)
  const io = new Server(httpServer, { cors: { origin: config.cors.origin } })
  setLikesSocket(io)

  io.on('connection', socket => {
    socket.emit('connected', { message: 'connected to vacation likes socket' })
  })

  httpServer.listen(config.app.port, () => {
    console.log(`${config.app.name} started on port ${config.app.port}`)
  })
}

start().catch(error => {
  console.error(error)
  process.exit(1)
})

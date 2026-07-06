import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import sequelize from './db/sequelize'
import config from './config'
import authRouter from './routers/auth'
import vacationsRouter from './routers/vacations'
import reportsRouter from './routers/reports'
import aiRouter from './routers/ai'
import mcpRouter from './routers/mcp'
import authEnforce from './middlewares/auth-enforce'
import { handleMcpRequest } from './mcp/transport'
import notFound from './middlewares/not-found'
import logError from './middlewares/error/log-error'
import respondError from './middlewares/error/error-responder'
import { ensureDemoAccounts } from './services/demo-accounts'

const app = express()

app.use(cors({ origin: config.cors.origin }))
app.use(morgan('dev'))
app.use(express.json())
app.use('/images', express.static(path.resolve(config.app.uploadsDir)))

app.get('/health', (request, response) => response.json({ status: 'ok', service: 'voyanta-backend', version: 'mcp-flexible-v2' }))
app.get('/api/version', (request, response) => response.json({ service: 'voyanta-backend', version: 'mcp-flexible-v2', authContract: 'jwt-and-user' }))

app.use('/api/auth', authRouter)
app.use('/api/vacations', authEnforce, vacationsRouter)
app.use('/api/reports', authEnforce, reportsRouter)
app.use('/api/ai', authEnforce, aiRouter)
app.use('/api/mcp', authEnforce, mcpRouter)

// Real MCP Streamable HTTP endpoint. The web MCP page calls it through /api/mcp/ask.
app.all('/mcp', authEnforce, handleMcpRequest)

app.use(notFound)
app.use(logError)
app.use(respondError)

export default app

export async function init() {
  await sequelize.sync({ force: config.app.syncForce })
  await ensureDemoAccounts()
}

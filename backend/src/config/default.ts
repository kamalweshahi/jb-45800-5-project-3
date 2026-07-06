export default {
  app: {
    port: Number(process.env.VACATIONS_PORT || 3000),
    name: 'Voyanta Vacations Dev',
    syncForce: process.env.VACATIONS_SYNC_FORCE === 'true',
    jwtKey: process.env.VACATIONS_JWT_KEY || 'vacation-secret',
    passwordKey: process.env.VACATIONS_PASSWORD_KEY || 'vacation-secret',
    publicBackendUrl: process.env.VACATIONS_PUBLIC_BACKEND_URL || 'http://localhost:3000',
    mcpServerUrl: process.env.VACATIONS_MCP_SERVER_URL || 'http://localhost:3000/mcp',
    uploadsDir: process.env.VACATIONS_UPLOADS_DIR || 'uploads/vacations'
  },
  db: {
    host: process.env.VACATIONS_DB_HOST || 'localhost',
    port: Number(process.env.VACATIONS_DB_PORT || 3306),
    username: process.env.VACATIONS_DB_USER || 'root',
    password: process.env.VACATIONS_DB_PASSWORD || '',
    database: process.env.VACATIONS_DB_NAME || 'vacations_project'
  },
  openai: {
    apiKey: process.env.VACATIONS_OPENAI_API_KEY || '',
    model: process.env.VACATIONS_OPENAI_MODEL || 'gpt-4.1-mini'
  },
  google: {
    clientId: process.env.VACATIONS_GOOGLE_CLIENT_ID || ''
  },
  cors: {
    origin: process.env.VACATIONS_CORS_ORIGIN || '*'
  }
}

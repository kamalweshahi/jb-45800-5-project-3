import defaultConfig from './default'

export default {
  ...defaultConfig,
  app: {
    ...defaultConfig.app,
    name: 'Voyanta Vacations Compose',
    publicBackendUrl: process.env.VACATIONS_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  },
  db: {
    ...defaultConfig.db,
    host: process.env.VACATIONS_DB_HOST || 'database'
  }
}

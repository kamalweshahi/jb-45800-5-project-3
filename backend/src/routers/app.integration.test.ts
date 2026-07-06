import request from 'supertest'
import app from '../app'
import sequelize from '../db/sequelize'

afterAll(async () => {
  await sequelize.close()
})

describe('application integration tests', () => {
  it('returns backend health information', async () => {
    const response = await request(app).get('/health')

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('ok')
    expect(response.body.service).toBe('voyanta-backend')
  })

  it('protects the vacations router when authentication is missing', async () => {
    const response = await request(app).get('/api/vacations')

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ message: 'Please login first.' })
  })

  it('returns a friendly 404 response for an unknown route', async () => {
    const response = await request(app).get('/api/unknown-route')

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('message')
  })
})

export type Role = 'user' | 'admin'

export interface JwtUser {
  id: number
  firstName: string
  lastName: string
  email: string
  role: Role
  iat?: number
  exp?: number
}

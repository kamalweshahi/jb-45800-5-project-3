import type { NextFunction, Request, Response } from 'express'
import { randomBytes } from 'crypto'
import { sign } from 'jsonwebtoken'
import config from '../../config'
import User, { Role } from '../../models/User'
import { ADMIN_EMAIL } from '../../services/demo-accounts'
import { getSafeUserSession } from '../../services/user-session'
import { hashPassword } from '../../utils/password'

function toAuthUser(user: User) {
  return getSafeUserSession(user)
}

function createJwt(user: User) {
  return sign({}, config.app.jwtKey, {
    subject: String(user.id),
    expiresIn: '7d'
  })
}

function createSession(user: User) {
  return {
    jwt: createJwt(user),
    user: toAuthUser(user)
  }
}

export function getCurrentUser(request: Request, response: Response) {
  response.json(request.currentUser)
}

export async function register(request: Request, response: Response, next: NextFunction) {
  try {
    const user = await User.create({
      ...request.body,
      email: request.body.email.trim().toLowerCase(),
      password: hashPassword(request.body.password),
      role: Role.User
    })
    await user.reload()
    response.status(201).json(createSession(user))
  } catch (error) {
    next(error)
  }
}

export async function login(request: Request, response: Response, next: NextFunction) {
  try {
    const email = request.body.email.trim().toLowerCase()
    const user = await User.findOne({
      where: {
        email,
        password: hashPassword(request.body.password)
      }
    })

    if (!user) return next({ status: 401, message: 'Email or password is incorrect.' })

    // The documented demo admin must always remain an administrator, even if
    // an older Docker volume previously stored this account with the user role.
    if (email === ADMIN_EMAIL && user.role !== Role.Admin) {
      user.role = Role.Admin
      await user.save()
      await user.reload()
    }

    response.json(createSession(user))
  } catch (error) {
    next(error)
  }
}

type GoogleTokenInfo = {
  aud: string
  email: string
  email_verified?: string | boolean
  given_name?: string
  family_name?: string
  name?: string
}

export async function googleLogin(request: Request, response: Response, next: NextFunction) {
  try {
    if (!config.google.clientId) return next({ status: 400, message: 'Google sign-in is not configured yet.' })

    const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(request.body.credential)}`)
    if (!tokenInfoResponse.ok) return next({ status: 401, message: 'Google sign-in failed. Please try again.' })

    const tokenInfo = await tokenInfoResponse.json() as GoogleTokenInfo
    const emailVerified = tokenInfo.email_verified === true || tokenInfo.email_verified === 'true'

    if (tokenInfo.aud !== config.google.clientId || !tokenInfo.email || !emailVerified) {
      return next({ status: 401, message: 'Google sign-in could not verify this account.' })
    }

    const normalizedEmail = tokenInfo.email.trim().toLowerCase()
    const [user] = await User.findOrCreate({
      where: { email: normalizedEmail },
      defaults: {
        firstName: tokenInfo.given_name || tokenInfo.name?.split(' ')[0] || 'Google',
        lastName: tokenInfo.family_name || 'Traveler',
        email: normalizedEmail,
        password: hashPassword(randomBytes(32).toString('hex')),
        role: Role.User
      }
    })

    // Google sign-in creates normal users. It must never silently promote a
    // Google account to admin unless that account is already admin in the DB.
    await user.reload()
    response.json(createSession(user))
  } catch (error) {
    next(error)
  }
}

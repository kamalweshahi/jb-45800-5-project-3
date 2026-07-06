import type User from '../models/User'
import { Role } from '../models/User'
import { normalizeRole } from './roles'

function readUserValue(user: User, key: string): unknown {
  const modelValue = typeof user.get === 'function' ? user.get(key) : undefined
  return modelValue ?? (user as unknown as Record<string, unknown>)[key]
}

function requiredText(user: User, key: string, label: string): string {
  const value = String(readUserValue(user, key) ?? '').trim()
  if (!value) throw new Error(`Authenticated user is missing ${label}.`)
  return value
}

export function getSafeUserSession(user: User) {
  const id = Number(readUserValue(user, 'id'))
  if (!Number.isInteger(id) || id <= 0) throw new Error('Authenticated user has an invalid id.')

  const email = requiredText(user, 'email', 'email').toLowerCase()
  const firstName = requiredText(user, 'firstName', 'first name')
  const lastName = requiredText(user, 'lastName', 'last name')
  const role = normalizeRole(readUserValue(user, 'role'))

  return { id, firstName, lastName, email, role: role as Role }
}

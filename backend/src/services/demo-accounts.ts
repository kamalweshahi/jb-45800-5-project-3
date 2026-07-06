import User, { Role } from '../models/User'
import { hashPassword } from '../utils/password'

export const ADMIN_EMAIL = 'admin@voyanta.local'
export const USER_EMAIL = 'user@voyanta.local'

/**
 * Keeps the documented demo accounts deterministic even when Docker reuses
 * a database volume created by an older build or the password key changes.
 */
export async function ensureDemoAccounts() {
  const [admin] = await User.findOrCreate({
    where: { email: ADMIN_EMAIL },
    defaults: {
      firstName: 'Kamal',
      lastName: 'Weshahi',
      email: ADMIN_EMAIL,
      password: hashPassword('Admin1234'),
      role: Role.Admin
    }
  })

  admin.firstName = 'Kamal'
  admin.lastName = 'Weshahi'
  admin.password = hashPassword('Admin1234')
  admin.role = Role.Admin
  await admin.save()
  await admin.reload()

  const [user] = await User.findOrCreate({
    where: { email: USER_EMAIL },
    defaults: {
      firstName: 'Demo',
      lastName: 'Traveler',
      email: USER_EMAIL,
      password: hashPassword('User1234'),
      role: Role.User
    }
  })

  user.firstName = 'Demo'
  user.lastName = 'Traveler'
  user.password = hashPassword('User1234')
  user.role = Role.User
  await user.save()
  await user.reload()
}

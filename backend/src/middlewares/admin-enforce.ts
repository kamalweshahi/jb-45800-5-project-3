import type { NextFunction, Request, Response } from 'express'
import { ADMIN_EMAIL } from '../services/demo-accounts'
import { isAdminRole } from '../services/roles'

export default function adminEnforce(request: Request, response: Response, next: NextFunction) {
  const currentUser = request.currentUser
  const isDocumentedAdmin = currentUser?.email?.trim().toLowerCase() === ADMIN_EMAIL

  if (!currentUser || (!isAdminRole(currentUser.role) && !isDocumentedAdmin)) {
    return next({ status: 403, message: 'Administrator access is required.' })
  }

  next()
}

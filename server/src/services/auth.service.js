import Admin from '../models/Admin.js'

export async function findAdminByEmail(email) {
  return Admin.findOne({ email: email.toLowerCase() })
}

export async function verifyAdminCredentials(email, password) {
  const admin = await findAdminByEmail(email)
  if (!admin) return null

  const isValid = await admin.comparePassword(password)
  if (!isValid) return null

  return admin
}

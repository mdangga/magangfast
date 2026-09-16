import crypto from 'crypto'

const SECRET_KEY = process.env.APP_SECRET || 'default-secret-salt-titikmagang-nextjs'

/**
 * Generate a signed submission URL with expiration (equivalent to Laravel temporarySignedRoute)
 */
export function generateSignedSubmissionUrl(expiresInHours: number = 24): string {
  const expires = Date.now() + expiresInHours * 60 * 60 * 1000
  const action = 'submit_location'
  const payload = `${action}:${expires}`
  
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('hex')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  return `${baseUrl}/locations/submit?action=${action}&expires=${expires}&signature=${signature}`
}

/**
 * Verify signed submission parameters from query string
 */
export function verifySignedSubmission(
  action: string | null | undefined,
  expires: string | null | undefined,
  signature: string | null | undefined
): { valid: boolean; reason?: string } {
  if (!action || !expires || !signature) {
    return { valid: false, reason: 'Parameter tautan tidak lengkap.' }
  }

  const expireTime = Number(expires)
  if (isNaN(expireTime)) {
    return { valid: false, reason: 'Format masa berlaku tidak valid.' }
  }

  if (Date.now() > expireTime) {
    return { valid: false, reason: 'Tautan pengajuan ini sudah kedaluwarsa (lebih dari 24 jam).' }
  }

  const payload = `${action}:${expires}`
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('hex')

  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
    if (!isValid) {
      return { valid: false, reason: 'Tanda tangan tautan tidak valid atau telah dimodifikasi.' }
    }
  } catch {
    return { valid: false, reason: 'Tanda tangan tautan tidak valid.' }
  }

  return { valid: true }
}


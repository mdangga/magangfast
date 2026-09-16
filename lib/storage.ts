import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

/**
 * Save an uploaded file to the public/uploads directory
 */
export async function saveUploadedFile(file: File, folder: string = 'location_images'): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
  await fs.mkdir(uploadDir, { recursive: true })

  const ext = path.extname(file.name) || '.jpg'
  const randomName = `${crypto.randomBytes(16).toString('hex')}${ext}`
  const filePath = path.join(uploadDir, randomName)

  await fs.writeFile(filePath, buffer)

  return `uploads/${folder}/${randomName}`
}

/**
 * Delete a file from the public/uploads directory
 */
export async function deleteUploadedFile(filePath: string): Promise<void> {
  try {
    if (!filePath) return
    const cleanPath = filePath.replace(/^\/+/, '')
    const fullPath = path.join(process.cwd(), 'public', cleanPath)
    await fs.unlink(fullPath)
  } catch {
    // Ignore error if file doesn't exist
  }
}


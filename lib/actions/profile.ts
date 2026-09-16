'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { saveUploadedFile, deleteUploadedFile } from '@/lib/storage'
import { ProfileWebType } from '@/types'

export async function getProfileWeb(): Promise<ProfileWebType | null> {
  try {
    const profile = await prisma.profileWeb.findFirst()
    if (!profile) return null
    return {
      id: Number(profile.id),
      app_name: profile.app_name,
      logo_path: profile.logo_path,
      description: profile.description,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }
  } catch (error) {
    console.error('Error fetching profile web:', error)
    return null
  }
}

export async function updateProfileWebAction(_prevState: unknown, formData: FormData) {
  const app_name = formData.get('app_name') as string
  const description = formData.get('description') as string
  const logo = formData.get('logo') as File | null

  if (!app_name?.trim() || !description?.trim()) {
    return { error: 'Nama aplikasi dan deskripsi wajib diisi.' }
  }

  try {
    const existing = await prisma.profileWeb.findFirst()

    let logo_path = existing?.logo_path || ''

    if (logo && logo.size > 0 && logo.name) {
      if (existing?.logo_path) {
        await deleteUploadedFile(existing.logo_path)
      }
      logo_path = await saveUploadedFile(logo, 'logos')
    }

    if (existing) {
      await prisma.profileWeb.update({
        where: { id: existing.id },
        data: {
          app_name: app_name.trim(),
          description: description.trim(),
          logo_path,
        },
      })
    } else {
      await prisma.profileWeb.create({
        data: {
          app_name: app_name.trim(),
          description: description.trim(),
          logo_path,
        },
      })
    }

    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/profile')

    return { success: true, message: 'Profil aplikasi berhasil diperbarui!' }
  } catch (error: any) {
    return { error: error.message || 'Gagal memperbarui profil website.' }
  }
}


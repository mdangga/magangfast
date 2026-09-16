'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { saveUploadedFile, deleteUploadedFile } from '@/lib/storage'
import { generateSignedSubmissionUrl } from '@/lib/signed-url'
import { LocationType } from '@/types'

/**
 * Get all approved locations for the public WebGIS map
 */
export async function getApprovedLocations(): Promise<LocationType[]> {
  try {
    const locations = await prisma.location.findMany({
      where: {
        approved_at: { not: null },
      },
      select: {
        id_location: true,
        id_category: true,
        id_department: true,
        student_name: true,
        nim: true,
        name_location: true,
        description: true,
        contact: true,
        latitude: true,
        longitude: true,
        approved_at: true,
        created_at: true,
        category: {
          select: {
            id_category: true,
            name_category: true,
          },
        },
        images: {
          where: { deleted_at: null },
          select: {
            id_image: true,
            image_path: true,
            alt_text: true,
            id_location: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    })

    return locations.map((loc) => ({
      ...loc,
      id_location: Number(loc.id_location),
      id_category: Number(loc.id_category),
      id_department: Number(loc.id_department),
      latitude: Number(loc.latitude),
      longitude: Number(loc.longitude),
      category: loc.category
        ? {
            id_category: Number(loc.category.id_category),
            name_category: loc.category.name_category,
          }
        : null,
      images: loc.images.map((img) => ({
        ...img,
        id_image: Number(img.id_image),
        id_location: Number(img.id_location),
      })),
    }))
  } catch (error) {
    console.error('Error fetching approved locations:', error)
    return []
  }
}

/**
 * Get all locations for admin management
 */
export async function getAllLocations(): Promise<LocationType[]> {
  try {
    const locations = await prisma.location.findMany({
      include: {
        category: true,
        department: {
          include: {
            faculty: true,
          },
        },
        images: {
          where: { deleted_at: null },
        },
      },
      orderBy: { created_at: 'desc' },
    })

    return locations.map((loc) => ({
      ...loc,
      id_location: Number(loc.id_location),
      id_category: Number(loc.id_category),
      id_department: Number(loc.id_department),
      latitude: Number(loc.latitude),
      longitude: Number(loc.longitude),
      category: loc.category
        ? {
            id_category: Number(loc.category.id_category),
            name_category: loc.category.name_category,
          }
        : null,
      department: loc.department
        ? {
            id_department: Number(loc.department.id_department),
            name_department: loc.department.name_department,
            degree_level: loc.department.degree_level,
            id_faculty: Number(loc.department.id_faculty),
            faculty: loc.department.faculty
              ? {
                  id_faculty: Number(loc.department.faculty.id_faculty),
                  name_faculty: loc.department.faculty.name_faculty,
                }
              : null,
          }
        : null,
      images: loc.images.map((img) => ({
        ...img,
        id_image: Number(img.id_image),
        id_location: Number(img.id_location),
      })),
    }))
  } catch (error) {
    console.error('Error fetching all locations:', error)
    return []
  }
}

/**
 * Get single location by ID with relations
 */
export async function getLocationById(id: number): Promise<LocationType | null> {
  try {
    const loc = await prisma.location.findUnique({
      where: { id_location: BigInt(id) },
      include: {
        category: true,
        department: {
          include: {
            faculty: true,
          },
        },
        images: {
          where: { deleted_at: null },
        },
      },
    })

    if (!loc) return null

    return {
      ...loc,
      id_location: Number(loc.id_location),
      id_category: Number(loc.id_category),
      id_department: Number(loc.id_department),
      latitude: Number(loc.latitude),
      longitude: Number(loc.longitude),
      category: loc.category
        ? {
            id_category: Number(loc.category.id_category),
            name_category: loc.category.name_category,
          }
        : null,
      department: loc.department
        ? {
            id_department: Number(loc.department.id_department),
            name_department: loc.department.name_department,
            degree_level: loc.department.degree_level,
            id_faculty: Number(loc.department.id_faculty),
            faculty: loc.department.faculty
              ? {
                  id_faculty: Number(loc.department.faculty.id_faculty),
                  name_faculty: loc.department.faculty.name_faculty,
                }
              : null,
          }
        : null,
      images: loc.images.map((img) => ({
        ...img,
        id_image: Number(img.id_image),
        id_location: Number(img.id_location),
      })),
    }
  } catch (error) {
    console.error('Error fetching location by id:', error)
    return null
  }
}

/**
 * Create a new location submission (from signed student form)
 */
export async function submitLocationAction(_prevState: unknown, formData: FormData) {
  try {
    const student_name = formData.get('student_name') as string
    const nim = formData.get('nim') as string
    const name_location = formData.get('name_location') as string
    const description = formData.get('description') as string
    const contact = formData.get('contact') as string
    const longitude = parseFloat(formData.get('longitude') as string)
    const latitude = parseFloat(formData.get('latitude') as string)
    const id_category = parseInt(formData.get('id_category') as string)
    const id_department = parseInt(formData.get('id_department') as string)

    if (
      !student_name ||
      !nim ||
      !name_location ||
      !description ||
      !contact ||
      isNaN(longitude) ||
      isNaN(latitude) ||
      isNaN(id_category) ||
      isNaN(id_department)
    ) {
      return { success: false, error: 'Harap lengkapi semua data formulir dengan benar.' }
    }

    // Check unique constraints
    const existingNim = await prisma.location.findFirst({
      where: { nim },
    })
    if (existingNim) {
      return { success: false, error: 'NIM ini sudah pernah mengajukan lokasi magang.' }
    }

    const existingLoc = await prisma.location.findFirst({
      where: { name_location },
    })
    if (existingLoc) {
      return { success: false, error: 'Nama tempat/perusahaan ini sudah terdaftar.' }
    }

    // Create location record
    const newLocation = await prisma.location.create({
      data: {
        student_name,
        nim,
        name_location,
        description,
        contact,
        longitude,
        latitude,
        id_category: BigInt(id_category),
        id_department: BigInt(id_department),
      },
    })

    // Handle image uploads
    const files = formData.getAll('images') as File[]
    for (const file of files) {
      if (file && file.size > 0 && file.name) {
        const savedPath = await saveUploadedFile(file, 'location_images')
        await prisma.image.create({
          data: {
            id_location: newLocation.id_location,
            image_path: savedPath,
            alt_text: name_location,
          },
        })
      }
    }

    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/locations')

    return { success: true, message: 'Lokasi magang berhasil diajukan! Menunggu persetujuan admin.' }
  } catch (error: any) {
    console.error('Error submitting location:', error)
    return { success: false, error: error.message || 'Terjadi kesalahan saat menyimpan data.' }
  }
}

/**
 * Approve a location
 */
export async function approveLocationAction(id: number) {
  try {
    await prisma.location.update({
      where: { id_location: BigInt(id) },
      data: { approved_at: new Date() },
    })

    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/locations')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Delete a location and remove associated image files
 */
export async function deleteLocationAction(id: number) {
  try {
    const loc = await prisma.location.findUnique({
      where: { id_location: BigInt(id) },
      include: { images: true },
    })

    if (!loc) {
      return { success: false, error: 'Lokasi tidak ditemukan.' }
    }

    // Delete stored files
    for (const img of loc.images) {
      if (img.image_path) {
        await deleteUploadedFile(img.image_path)
      }
    }

    await prisma.image.deleteMany({
      where: { id_location: BigInt(id) },
    })

    await prisma.location.delete({
      where: { id_location: BigInt(id) },
    })

    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/locations')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Generate a 24-hour signed link for location submission
 */
export async function generateSignedLinkAction() {
  const link = generateSignedSubmissionUrl(24)
  return { success: true, link }
}


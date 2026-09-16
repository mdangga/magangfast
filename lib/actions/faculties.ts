'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { FacultyType } from '@/types'

export async function getFaculties(): Promise<FacultyType[]> {
  try {
    const faculties = await prisma.faculty.findMany({
      include: {
        departments: true,
        _count: {
          select: { departments: true },
        },
      },
      orderBy: { name_faculty: 'asc' },
    })

    return faculties.map((f) => ({
      id_faculty: Number(f.id_faculty),
      name_faculty: f.name_faculty,
      created_at: f.created_at,
      updated_at: f.updated_at,
      departments_count: f._count.departments,
      departments: f.departments.map((d) => ({
        id_department: Number(d.id_department),
        name_department: d.name_department,
        degree_level: d.degree_level,
        id_faculty: Number(d.id_faculty),
        created_at: d.created_at,
        updated_at: d.updated_at,
      })),
    }))
  } catch (error) {
    console.error('Error fetching faculties:', error)
    return []
  }
}

export async function getFacultyById(id: number): Promise<FacultyType | null> {
  try {
    const f = await prisma.faculty.findUnique({
      where: { id_faculty: BigInt(id) },
    })
    if (!f) return null
    return {
      id_faculty: Number(f.id_faculty),
      name_faculty: f.name_faculty,
      created_at: f.created_at,
      updated_at: f.updated_at,
    }
  } catch {
    return null
  }
}

export async function createFacultyAction(_prevState: unknown, formData: FormData) {
  const name_faculty = formData.get('name_faculty') as string

  if (!name_faculty?.trim()) {
    return { error: 'Nama fakultas wajib diisi.' }
  }

  try {
    await prisma.faculty.create({
      data: { name_faculty: name_faculty.trim() },
    })
    revalidatePath('/faculties')
    revalidatePath('/departments')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal menambahkan fakultas.' }
  }
}

export async function updateFacultyAction(id: number, _prevState: unknown, formData: FormData) {
  const name_faculty = formData.get('name_faculty') as string

  if (!name_faculty?.trim()) {
    return { error: 'Nama fakultas wajib diisi.' }
  }

  try {
    await prisma.faculty.update({
      where: { id_faculty: BigInt(id) },
      data: { name_faculty: name_faculty.trim() },
    })
    revalidatePath('/faculties')
    revalidatePath('/departments')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal memperbarui fakultas.' }
  }
}

export async function deleteFacultyAction(id: number) {
  try {
    await prisma.faculty.delete({
      where: { id_faculty: BigInt(id) },
    })
    revalidatePath('/faculties')
    revalidatePath('/departments')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus fakultas.' }
  }
}


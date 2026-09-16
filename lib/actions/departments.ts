'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { DepartmentType } from '@/types'

export async function getDepartments(): Promise<DepartmentType[]> {
  try {
    const departments = await prisma.department.findMany({
      include: {
        faculty: true,
        _count: {
          select: { locations: true },
        },
      },
      orderBy: { name_department: 'asc' },
    })

    return departments.map((d) => ({
      id_department: Number(d.id_department),
      name_department: d.name_department,
      degree_level: d.degree_level,
      id_faculty: Number(d.id_faculty),
      created_at: d.created_at,
      updated_at: d.updated_at,
      locations_count: d._count.locations,
      faculty: d.faculty
        ? {
            id_faculty: Number(d.faculty.id_faculty),
            name_faculty: d.faculty.name_faculty,
          }
        : null,
    }))
  } catch (error) {
    console.error('Error fetching departments:', error)
    return []
  }
}

export async function getDepartmentById(id: number): Promise<DepartmentType | null> {
  try {
    const d = await prisma.department.findUnique({
      where: { id_department: BigInt(id) },
      include: { faculty: true },
    })
    if (!d) return null
    return {
      id_department: Number(d.id_department),
      name_department: d.name_department,
      degree_level: d.degree_level,
      id_faculty: Number(d.id_faculty),
      created_at: d.created_at,
      updated_at: d.updated_at,
      faculty: d.faculty
        ? {
            id_faculty: Number(d.faculty.id_faculty),
            name_faculty: d.faculty.name_faculty,
          }
        : null,
    }
  } catch {
    return null
  }
}

export async function createDepartmentAction(_prevState: unknown, formData: FormData) {
  const name_department = formData.get('name_department') as string
  const degree_level = formData.get('degree_level') as string
  const id_faculty = parseInt(formData.get('id_faculty') as string)

  if (!name_department?.trim() || !degree_level || isNaN(id_faculty)) {
    return { error: 'Semua field jurusan wajib diisi.' }
  }

  try {
    await prisma.department.create({
      data: {
        name_department: name_department.trim(),
        degree_level,
        id_faculty: BigInt(id_faculty),
      },
    })
    revalidatePath('/departments')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal menambahkan jurusan.' }
  }
}

export async function updateDepartmentAction(id: number, _prevState: unknown, formData: FormData) {
  const name_department = formData.get('name_department') as string
  const degree_level = formData.get('degree_level') as string
  const id_faculty = parseInt(formData.get('id_faculty') as string)

  if (!name_department?.trim() || !degree_level || isNaN(id_faculty)) {
    return { error: 'Semua field jurusan wajib diisi.' }
  }

  try {
    await prisma.department.update({
      where: { id_department: BigInt(id) },
      data: {
        name_department: name_department.trim(),
        degree_level,
        id_faculty: BigInt(id_faculty),
      },
    })
    revalidatePath('/departments')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal memperbarui jurusan.' }
  }
}

export async function deleteDepartmentAction(id: number) {
  try {
    await prisma.department.delete({
      where: { id_department: BigInt(id) },
    })
    revalidatePath('/departments')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus jurusan.' }
  }
}


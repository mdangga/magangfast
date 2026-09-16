'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { CategoryType } from '@/types'

export async function getCategories(): Promise<CategoryType[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { locations: true },
        },
      },
      orderBy: { name_category: 'asc' },
    })

    return categories.map((c) => ({
      id_category: Number(c.id_category),
      name_category: c.name_category,
      created_at: c.created_at,
      updated_at: c.updated_at,
      locations_count: c._count.locations,
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoryById(id: number): Promise<CategoryType | null> {
  try {
    const c = await prisma.category.findUnique({
      where: { id_category: BigInt(id) },
    })
    if (!c) return null
    return {
      id_category: Number(c.id_category),
      name_category: c.name_category,
      created_at: c.created_at,
      updated_at: c.updated_at,
    }
  } catch {
    return null
  }
}

export async function createCategoryAction(_prevState: unknown, formData: FormData) {
  const name_category = formData.get('name_category') as string

  if (!name_category?.trim()) {
    return { error: 'Nama kategori wajib diisi.' }
  }

  try {
    await prisma.category.create({
      data: { name_category: name_category.trim() },
    })
    revalidatePath('/categories')
    revalidatePath('/dashboard')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal menambahkan kategori.' }
  }
}

export async function updateCategoryAction(id: number, _prevState: unknown, formData: FormData) {
  const name_category = formData.get('name_category') as string

  if (!name_category?.trim()) {
    return { error: 'Nama kategori wajib diisi.' }
  }

  try {
    await prisma.category.update({
      where: { id_category: BigInt(id) },
      data: { name_category: name_category.trim() },
    })
    revalidatePath('/categories')
    revalidatePath('/dashboard')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Gagal memperbarui kategori.' }
  }
}

export async function deleteCategoryAction(id: number) {
  try {
    await prisma.category.delete({
      where: { id_category: BigInt(id) },
    })
    revalidatePath('/categories')
    revalidatePath('/dashboard')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus kategori.' }
  }
}


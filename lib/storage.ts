import { supabase } from '@/lib/supabase' // Sesuaikan path import supabase Anda

/**
 * Save an uploaded file to Supabase Storage bucket ('imageMagang')
 */
export async function saveUploadedFile(file: File, folder: string = 'location_images'): Promise<string> {
  // 1. Ubah File menjadi ArrayBuffer lalu ke Buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // 1. Bersihkan nama file asli dari spasi atau karakter aneh
  const originalName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
  const ext = originalName.split('.').pop() || 'jpg'
  
  // 2. Buat nama file unik
  const randomName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
  
  // 3. Pastikan format path bersih (contoh: logos/17100000-abc.jpg)
  const filePath = `${folder.trim()}/${randomName}`

  // 3. Upload ke Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('imageMagang') // Ganti dengan nama bucket Anda di Supabase
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false
    })

  if (uploadError) {
    throw new Error(`Gagal upload ke Supabase: ${uploadError.message}`)
  }

  // 4. Ambil Public URL dari file yang di-upload
  const { data } = supabase.storage
    .from('imageMagang')
    .getPublicUrl(filePath)

  // 5. Kembalikan URL publiknya untuk disimpan ke database Aiven
  return data.publicUrl
}

/**
 * Delete a file from Supabase Storage bucket
 */
export async function deleteUploadedFile(fileUrl: string): Promise<void> {
  try {
    if (!fileUrl) return

    // Ekstrak path file dari URL publik Supabase
    // Contoh URL: https://xxxx.supabase.co/storage/v1/object/public/imageMagang/location_images/abc.jpg
    const marker = '/imageMagang/'
    const parts = fileUrl.split(marker)
    if (parts.length < 2) return

    const filePath = parts[1] // Hasilnya: location_images/abc.jpg

    // Hapus file dari Supabase Storage
    const { error } = await supabase.storage
      .from('imageMagang')
      .remove([filePath])

    if (error) {
      console.error('Gagal menghapus file dari Supabase:', error.message)
    }
  } catch (error) {
    // Ignore error if file deletion fails
    console.error('Error saat menghapus file:', error)
  }
}
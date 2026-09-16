export interface CategoryType {
  id_category: number
  name_category: string
  created_at?: Date | string | null
  updated_at?: Date | string | null
  locations_count?: number
}

export interface FacultyType {
  id_faculty: number
  name_faculty: string
  created_at?: Date | string | null
  updated_at?: Date | string | null
  departments?: DepartmentType[]
  departments_count?: number
}

export interface DepartmentType {
  id_department: number
  name_department: string
  degree_level: string
  id_faculty: number
  created_at?: Date | string | null
  updated_at?: Date | string | null
  faculty?: FacultyType | null
  locations_count?: number
}

export interface ImageType {
  id_image: number
  image_path: string
  alt_text?: string | null
  id_location: number
  created_at?: Date | string | null
}

export interface LocationType {
  id_location: number
  student_name: string
  nim: string
  name_location: string
  description: string
  contact: string
  longitude: number
  latitude: number
  approved_at?: Date | string | null
  id_category: number
  id_department: number
  created_at?: Date | string | null
  updated_at?: Date | string | null
  category?: CategoryType | null
  department?: (DepartmentType & { faculty?: FacultyType | null }) | null
  images?: ImageType[]
}

export interface ProfileWebType {
  id: number
  app_name: string
  logo_path: string
  description: string
  created_at?: Date | string | null
  updated_at?: Date | string | null
}

export interface SessionUser {
  id: number
  name: string
  email: string
}


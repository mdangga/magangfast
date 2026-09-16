import { getApprovedLocations } from '@/lib/actions/locations'
import { getCategories } from '@/lib/actions/categories'
import { WebGisView } from '@/components/public/WebGisView'

export const revalidate = 0 // Always fetch fresh approved locations

export default async function HomePage() {
  const [locations, categories] = await Promise.all([
    getApprovedLocations(),
    getCategories(),
  ])

  return <WebGisView initialLocations={locations} categories={categories} />
}


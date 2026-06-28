import { createServerSupabase } from '@/lib/supabase-server'
import CoursesListClient from '@/components/CoursesListClient'

export default async function AllCoursesPage() {
  const supabase = createServerSupabase()
  const { data: courses } = await supabase.from('courses').select('*')

  return <CoursesListClient courses={courses || []} />
}
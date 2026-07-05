import { createServerSupabase } from '@/lib/supabase-server'
import SiteHeader from '@/components/SiteHeader'
import CoursesListClient from '@/components/CoursesListClient'

export default async function AllCoursesPage() {
  const supabase = createServerSupabase()
  const { data: courses } = await supabase.from('courses').select('*')

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 40px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, margin: '0 0 20px' }}>All courses</h1>
        <CoursesListClient courses={courses || []} />
      </div>
    </div>
  )
}

import { createServerSupabase } from '@/lib/supabase-server'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
  const supabase = createServerSupabase()
  const { data: courses } = await supabase.from('courses').select('*')

  return <HomeClient courses={courses || []} />
}
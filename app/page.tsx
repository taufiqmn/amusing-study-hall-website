// Refresh homepage data every 5 minutes — new courses/lessons/quizzes
// appear automatically without redeploying.
export const revalidate = 300

import { createServerSupabase } from '@/lib/supabase-server'
import HomeClient from '@/components/HomeClient'

// Homepage data is LIVE from the database:
// add a course or lesson in Supabase → counts, topics and
// course highlight cards update automatically. No code edits.

export default async function HomePage() {
  const supabase = createServerSupabase()

  const [{ data: courses }, { data: lessons }, { count: quizCount }] = await Promise.all([
    supabase.from('courses').select('*'),
    supabase.from('lessons').select('id, title, course_id'),
    supabase.from('quiz_questions_public').select('id', { count: 'exact', head: true }),
  ])

  const lessonList = lessons || []

  // per-course lesson counts for the highlight cards
  const lessonCounts: Record<string, number> = {}
  for (const l of lessonList) {
    lessonCounts[l.course_id] = (lessonCounts[l.course_id] || 0) + 1
  }

  // marquee topics = course subjects + a sample of lesson keywords (auto-grows)
  const topicSet = new Set<string>()
  for (const c of courses || []) {
    if (c.subject) topicSet.add(String(c.subject))
    else if (c.title) topicSet.add(String(c.title))
  }
  for (const l of lessonList) {
    const first = String(l.title || '').split(/[—:–-]/)[0].trim()
    if (first && first.length <= 28) topicSet.add(first)
    if (topicSet.size >= 18) break
  }

  const stats = {
    courses: (courses || []).length,
    lessons: lessonList.length,
    quizzes: quizCount || 0,
  }

  return (
    <HomeClient
      courses={courses || []}
      stats={stats}
      topics={Array.from(topicSet)}
      lessonCounts={lessonCounts}
    />
  )
}

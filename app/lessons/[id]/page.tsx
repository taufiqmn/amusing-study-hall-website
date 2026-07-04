import type { Metadata } from 'next'
import { createServerSupabase } from '@/lib/supabase-server'
import LessonClient from '@/components/LessonClient'

// SEO FIX: the lesson is now fetched on the SERVER, so Google sees
// the real title + description instead of "Loading...".

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = createServerSupabase()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title, explanation')
    .eq('id', id)
    .single()

  if (!lesson) return { title: 'Lesson — Amusing Study Hall' }

  return {
    title: `${lesson.title} — Amusing Study Hall`,
    description:
      (lesson.explanation || '').slice(0, 155) ||
      `Learn ${lesson.title} for free with interactive explanations, quizzes and practice problems.`,
  }
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params
  const supabase = createServerSupabase()

  const { data: lesson } = await supabase.from('lessons').select('*').eq('id', id).single()

  let siblings: any[] = []
  if (lesson) {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', lesson.course_id)
      .order('order_index', { ascending: true })
    siblings = data || []
  }

  return <LessonClient initialLesson={lesson} initialSiblings={siblings} />
}

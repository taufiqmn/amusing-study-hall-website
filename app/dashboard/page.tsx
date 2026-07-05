import SiteHeader from '@/components/SiteHeader'
import DashboardClient from '@/components/dashboard/DashboardClient'

export const metadata = { title: 'Dashboard — Amusing Study Hall' }

export default function DashboardPage() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />
      <DashboardClient />
    </div>
  )
}

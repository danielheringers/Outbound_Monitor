import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardContent } from './dashboard-content'

export default function DashboardPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('authToken')

  if (!token) {
    redirect('/login')
  }

  return <DashboardContent />
}
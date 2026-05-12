import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AdminDashboard } from '@/components/AdminDashboard'
import { serverApiFetch } from '@/lib/api'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('vlaecci_admin_session')

  if (!sessionCookie) {
    redirect('/admin/login')
  }

  try {
    const response = await serverApiFetch('/auth/me', {
      headers: {
        Cookie: `vlaecci_admin_session=${sessionCookie.value}`,
      },
    })

    if (!response.ok) {
      redirect('/admin/login')
    }
  } catch {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}

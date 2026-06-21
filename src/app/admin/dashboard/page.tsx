import { fetchAdminDashBoard } from '@/app/lib/data'
import AdminDashboardClient from '@/components/dashboard/AdminDashboardClient'

export default async function AdminDashboard() {
  const response = await fetchAdminDashBoard()
  
  // Serialize Mongoose Objects safely for Client Component consumption
  const serializedUsers = (response?.data?.users || []).map((user: { _id: { toString(): string }; username: string; organizationName?: string; isApproved: boolean; createdAt?: Date }) => ({
    _id: user._id.toString(),
    username: user.username,
    organizationName: user.organizationName || '',
    isApproved: user.isApproved,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : undefined
  }))

  return (
    <div className="min-h-screen bg-surface-dim text-on-surface font-body-md overflow-x-hidden relative">
      <main className="max-w-container-max mx-auto p-lg relative pt-24">
        {/* Header */}
        <header className="flex justify-between items-center mb-xl">
          <div>
            <h2 className="font-display-lg text-3xl font-bold text-on-surface">Admin Dashboard</h2>
            <p className="text-on-surface-variant text-sm mt-xs">Managing global network entities and security protocols.</p>
          </div>
          <div className="flex items-center space-x-md">
            <button className="p-2 bg-surface-container hover:bg-surface-variant rounded-full transition-colors relative">
              <span className="material-symbols-outlined text-on-surface-variant block text-xl">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-outline-variant/30"></div>
            <div className="flex items-center space-x-2">
              <span className="text-on-surface-variant text-xs font-semibold tracking-wider font-label-caps">LAST SYNC:</span>
              <span className="text-secondary font-bold text-xs font-label-caps uppercase tracking-wider">Just now</span>
            </div>
          </div>
        </header>

        {/* Client Interactive Dashboard */}
        <AdminDashboardClient initialUsers={serializedUsers} />
      </main>
    </div>
  )
}
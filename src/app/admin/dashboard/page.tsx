import { fetchAdminDashBoard } from '@/app/lib/data'
import ApproveBtn from '@/components/dashboard/ApproveBtn';
import { Button } from '@/components/ui/button'
import mongoose from 'mongoose'



const AdminDashboard = async() => {
  const response = await fetchAdminDashBoard();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg">This is the admin dashboard where you can manage users and settings.</p>
      <div className="mt-8 w-full max-w-2xl  shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <p className="text-gray-600 mb-4">Here you can view and manage all organization users.</p>
        {/* Placeholder for user list */}
        {Array.isArray(response?.data?.users) && response?.data?.users.length !== 0 ? 
          response?.data?.users.map((user :{_id: mongoose.Types.ObjectId, username: string, organizationName?: string|undefined, isApproved: boolean }) => (
            <div key={user._id.toString()} className="flex justify-between items-center p-4 mb-2  rounded-lg shadow-sm">
              <span>{user.username} ({user.organizationName})</span>
              <div>
                <ApproveBtn user={user} />
              </div>
            </div>
          )) : 
          <p className="text-gray-500">No users found.</p>
        }
        
      </div>
    </div>
  )
}

export default AdminDashboard
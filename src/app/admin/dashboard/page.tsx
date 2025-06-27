'use client'
import { Button } from '@/components/ui/button'
import mongoose from 'mongoose'
import React, { useEffect } from 'react'

type User = {
  _id: mongoose.Types.ObjectId
  username: string
  organizationName: string
  isApproved: boolean
}

const AdminDashboard = () => {
  const [users, setUsers] = React.useState<User[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/auth' // Redirect to auth page if not logged in
    } else {
      
      fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setUsers(data)
        })
    }
  }, [])

  function updateOrganizationUser(userId: string, isApproved: boolean) {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/auth' // Redirect to auth page if not logged in
    } else {
      fetch('/api/admin/dashboard', { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, isApproved }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.message === 'User updated') {
            // Update the local state to reflect the change
            setUsers((prevUsers) =>
              prevUsers.map(user =>
                user._id.toString() === userId ? { ...user, isApproved } : user
              )
            )
          } else {
            alert(data.message || 'Failed to update user')
          }
        })
        .catch(err => {
          console.error('Error updating user:', err)
          alert('Failed to update user')
        })
    }
  }

  // It will contain all organization users List with button to approve or reject
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg">This is the admin dashboard where you can manage users and settings.</p>
      <div className="mt-8 w-full max-w-2xl  shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <p className="text-gray-600 mb-4">Here you can view and manage all organization users.</p>
        {/* Placeholder for user list */}
        {Array.isArray(users) && users.length !== 0 ? 
          users.map((user :{_id: mongoose.Types.ObjectId, username: string, organizationName: string, isApproved: boolean }) => (
            <div key={user._id.toString()} className="flex justify-between items-center p-4 mb-2  rounded-lg shadow-sm">
              <span>{user.username} ({user.organizationName})</span>
              <div>
              
              <Button 
              onClick={() => updateOrganizationUser(user._id.toString(), !user.isApproved)}
              className={"text-white px-3 py-1 rounded"+(user.isApproved ? ' bg-red-500': ' bg-green-500')}>
                {user.isApproved ? 'Reject': 'Approve'}
              </Button> 
                
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
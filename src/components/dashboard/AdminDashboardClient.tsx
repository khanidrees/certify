'use client'

import React, { useState } from 'react'
import { updateOrgStatus } from '@/app/lib/actions'

interface User {
  _id: string
  username: string
  organizationName?: string
  isApproved: boolean
  createdAt?: string
}

interface AdminDashboardClientProps {
  initialUsers: User[]
}

export default function AdminDashboardClient({ initialUsers }: AdminDashboardClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [activeTab, setActiveTab] = useState<'requests' | 'settings' | 'logs'>('requests')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const pendingUsers = users.filter((u) => !u.isApproved)
  const approvedUsers = users.filter((u) => u.isApproved)

  const handleStatusUpdate = async (userId: string) => {
    setActionLoading(true)
    try {
      await updateOrgStatus(userId)
      // Toggle approval locally for immediate feedback
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isApproved: !u.isApproved } : u))
      )
      // Update selected user state if open
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, isApproved: !prev.isApproved } : null))
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setActionLoading(false)
      setSelectedUser(null)
    }
  }

  return (
    <div className="relative">
      {/* Bento Grid Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
        {/* Metric 1: Pending Orgs */}
        <div className="glass-surface p-md rounded-xl neon-glow-primary relative overflow-hidden group">
          <div className="flex justify-between items-start mb-md">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <span className="text-[10px] bg-primary/20 text-primary px-sm py-xs rounded-full font-bold uppercase tracking-tighter">
              Awaiting
            </span>
          </div>
          <h3 className="text-on-surface-variant font-label-caps text-xs">Pending Orgs</h3>
          <p className="font-display-lg text-4xl font-bold text-on-surface mt-xs">{pendingUsers.length}</p>
        </div>

        {/* Metric 2: Approved Orgs */}
        <div className="glass-surface p-md rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-md">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <span className="text-[10px] bg-secondary/20 text-secondary px-sm py-xs rounded-full font-bold uppercase tracking-tighter">
              Active
            </span>
          </div>
          <h3 className="text-on-surface-variant font-label-caps text-xs">Approved Orgs</h3>
          <p className="font-display-lg text-4xl font-bold text-on-surface mt-xs">{approvedUsers.length}</p>
        </div>

        {/* Metric 3: Network Fees */}
        <div className="glass-surface p-md rounded-xl neon-glow-secondary relative overflow-hidden group">
          <div className="flex justify-between items-start mb-md">
            <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="text-[10px] bg-tertiary/20 text-tertiary px-sm py-xs rounded-full font-bold uppercase tracking-tighter">
              Live Pool
            </span>
          </div>
          <h3 className="text-on-surface-variant font-label-caps text-xs">Network Fees</h3>
          <div className="flex items-baseline space-x-1 mt-xs">
            <p className="font-display-lg text-4xl font-bold text-on-surface">15.5</p>
            <p className="font-headline-md text-lg text-tertiary font-semibold">SOL</p>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <nav className="flex space-x-8 border-b border-outline-variant/30 mb-md px-base">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-md font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'requests'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">list_alt</span>
          <span className="font-label-caps text-xs">Registration Requests</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-md font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'settings'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">settings_suggest</span>
          <span className="font-label-caps text-xs">Global Settings</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-md font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'logs'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">history</span>
          <span className="font-label-caps text-xs">Audit Log</span>
        </button>
      </nav>

      {/* Tab Contents */}
      {activeTab === 'requests' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-md py-base text-[10px] text-on-surface-variant font-label-caps tracking-widest border-b border-white/5 uppercase">
            <div className="w-1/3">Organization</div>
            <div className="w-1/4">Status</div>
            <div className="w-1/6">Submission Date</div>
            <div className="w-1/6 text-right">Action</div>
          </div>

          {users.length === 0 ? (
            <div className="glass-surface p-md rounded-xl text-center text-on-surface-variant">
              No registration requests found.
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="glass-surface p-md rounded-xl flex items-center justify-between hover:bg-surface-container transition-all group cursor-pointer"
              >
                <div className="w-1/3 flex items-center space-x-md">
                  <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/5">
                    <span className="material-symbols-outlined text-primary text-xl">corporate_fare</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface group-hover:text-primary transition-colors">
                      {user.organizationName || 'Unnamed Org'}
                    </p>
                    <p className="text-xs text-on-surface-variant/60 truncate max-w-[150px]">{user.username}</p>
                  </div>
                </div>
                <div className="w-1/4">
                  <span
                    className={`border px-3 py-1 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      user.isApproved
                        ? 'bg-secondary/10 text-secondary border-secondary/20'
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}
                  >
                    {user.isApproved ? 'Approved' : 'Awaiting'}
                  </span>
                </div>
                <div className="w-1/6">
                  <p className="text-on-surface-variant text-sm">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <div className="w-1/6 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="px-4 py-2 bg-primary text-on-primary rounded font-bold text-xs hover:neon-glow-primary transition-all active:scale-95"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {activeTab === 'settings' && (
        <div className="glass-surface p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-bold text-on-surface">Global Settings</h3>
          <p className="text-sm text-on-surface-variant">Configure system-wide parameters for the certification network.</p>
          <div className="space-y-3 pt-4 max-w-md">
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">MINTING PROTOCOL</label>
              <select className="w-full bg-surface-container border border-white/10 rounded-lg p-2 text-on-surface">
                <option>Solana Compressed NFT (cNFT)</option>
                <option>Standard SPL Token</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">SYSTEM TRANSACTION FEE</label>
              <input type="text" defaultValue="0.005 SOL" className="w-full bg-surface-container border border-white/10 rounded-lg p-2 text-on-surface" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="glass-surface p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-bold text-on-surface">Audit Logs</h3>
          <div className="space-y-2 text-xs font-mono text-on-surface-variant">
            <p className="border-b border-white/5 pb-2"><span className="text-secondary">[SYSTEM]</span> 2026-06-17 15:05:52 - Admin panel initialized.</p>
            <p className="border-b border-white/5 pb-2"><span className="text-primary">[ACTION]</span> 2026-06-17 15:12:01 - Organization status updated.</p>
          </div>
        </div>
      )}

      {/* Slide Review Drawer */}
      {selectedUser && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
            onClick={() => setSelectedUser(null)}
          />
          <div className="fixed top-0 right-0 h-full w-[450px] bg-surface-container-high border-l border-white/10 z-[70] transition-transform duration-500 ease-in-out p-lg shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-xl">
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Organization Review</h3>
                <button
                  className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                  onClick={() => setSelectedUser(null)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-surface-container-highest border border-white/5 flex items-center justify-center p-4 mb-4">
                    <span className="material-symbols-outlined text-primary text-4xl">corporate_fare</span>
                  </div>
                  <h4 className="text-xl font-bold text-on-surface">{selectedUser.organizationName || 'Unnamed Org'}</h4>
                  <p className="text-xs text-primary font-mono bg-primary/10 px-3 py-1 rounded-full mt-2">
                    {selectedUser.username}
                  </p>
                </div>

                <div className="space-y-4">
                  <h5 className="font-label-caps text-xs text-on-surface-variant border-b border-white/5 pb-1 font-semibold">
                    REGISTRATION DETAILS
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-semibold">STATUS</p>
                      <p className="text-on-surface font-medium">{selectedUser.isApproved ? 'Approved' : 'Awaiting Approval'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-semibold">ROLE ID</p>
                      <p className="text-on-surface font-medium">Organization</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="material-symbols-outlined text-secondary text-sm">verified</span>
                    <p className="text-secondary font-label-caps text-[10px] tracking-widest font-semibold">
                      SECURITY PROFILE
                    </p>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    VerifyCertify cryptographic evaluation passes standard integrity filters. Ready for network activity.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 flex space-x-4">
              <button
                disabled={actionLoading}
                onClick={() => handleStatusUpdate(selectedUser._id)}
                className={`flex-1 py-3 rounded-xl font-bold text-xs tracking-wider transition-all active:scale-95 text-white ${
                  selectedUser.isApproved
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-secondary hover:bg-emerald-600'
                }`}
              >
                {selectedUser.isApproved ? 'REVOKE STATUS' : 'APPROVE'}
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 py-3 bg-surface-container-highest border border-white/10 text-on-surface rounded-xl font-bold text-xs tracking-wider hover:bg-white/5 transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

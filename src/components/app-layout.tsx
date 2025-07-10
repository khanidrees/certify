'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import { AppHeader } from '@/components/app-header'
import React from 'react'
import { AppFooter } from '@/components/app-footer'
import { ClusterChecker } from '@/components/cluster/cluster-ui'
import { AccountChecker } from '@/components/account/account-ui'
import { UserRole } from '@/models/User'

export function AppLayout({
  children,
  links,
  role
}: {
  children: React.ReactNode
  links: { label: string; path: string }[]
  role: UserRole | null
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen">
        <AppHeader links={links} role={role} />
        <main className="flex-grow">
          <ClusterChecker>
            <AccountChecker />
          </ClusterChecker>
          {children}
        </main>
        {/* <AppFooter /> */}
      </div>
      <Toaster />
    </ThemeProvider>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/app-layout'
import React from 'react'
import { cookies } from 'next/headers'
import { UserRole } from '@/models/User'

export const metadata: Metadata = {
  title: 'VerifyCertify',
  description: 'Solana DApp for Issuing Verifyable Certificates',
}

const links: { label: string; path: string }[] = [
  // More links...
  { label: 'Home', path: '/' },
  { label: 'Account', path: '/account' },
  // { label: 'Counter Program', path: '/counter' },
]

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const role = (await cookies()).get('role')?.value as UserRole || null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <AppProviders>
          <AppLayout 
            links={links}
            role={role}  
          >{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

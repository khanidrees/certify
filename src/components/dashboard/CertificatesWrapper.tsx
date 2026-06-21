'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const Certificates = dynamic(() => import('./Certificates'), { ssr: false })

export default function CertificatesWrapper({ userId }: { userId: string }) {
  return <Certificates userId={userId} />
}

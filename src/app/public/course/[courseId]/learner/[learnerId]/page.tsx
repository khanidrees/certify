'use client'

import { useCertificateByCourseIdLearnerId } from '@/components/counter/counter-data-access'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

export default function CertificateVerification() {
  const { courseId, learnerId }: { courseId: string; learnerId: string } = useParams()
  const certificate = useCertificateByCourseIdLearnerId(courseId || '', learnerId || '')
  const verifiedCertificate = certificate.data?.length ? certificate.data[0] : null
  const [copied, setCopied] = useState(false)

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (certificate.isLoading) {
    return (
      <div className="min-h-screen bg-surface-dim text-on-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <LoadingSpinner size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Verifying Certificate...</h1>
          <p className="text-xs text-on-surface-variant">Checking ledger integrity on Solana...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-dim text-on-surface font-body-md relative overflow-x-hidden pt-24 pb-12">
      {/* Glow Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/30 filter blur-[80px] pointer-events-none" />

      <main className="max-w-container-max mx-auto px-md z-10 relative">
        {/* Verification Status Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <h1 className="font-display-lg text-3xl font-bold text-on-surface mb-xs">Official Credential</h1>
            <p className="text-on-surface-variant text-sm">Immutable proof of achievement secured by Solana Blockchain.</p>
          </div>
          
          {verifiedCertificate ? (
            <div className="flex items-center gap-sm bg-secondary/10 border border-secondary/30 rounded-full px-4 py-2 pr-6 pulse-badge">
              <div className="bg-secondary rounded-full p-1 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <span className="font-label-caps text-xs text-secondary tracking-widest uppercase font-semibold">Solana Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-sm bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 pr-6">
              <div className="bg-red-500 rounded-full p-1 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
              </div>
              <span className="font-label-caps text-xs text-red-400 tracking-widest uppercase font-semibold">Not Found</span>
            </div>
          )}
        </div>

        {verifiedCertificate ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* Left: Certificate Graphic Projection */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <div className="glass-surface w-full max-w-[600px] aspect-[1.414/1] rounded-xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                {/* Holographic light glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-tertiary/5 pointer-events-none" />
                
                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    <div className="flex flex-col">
                      <span className="font-title-sm text-sm font-bold text-on-surface tracking-widest uppercase">SOLANA ACADEMY</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant">Engineering Excellence</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-caps text-[10px] text-primary block font-semibold mb-1">CREDENTIAL ID</span>
                    <span className="font-body-md text-xs text-on-surface font-mono tracking-wider">VC-{(verifiedCertificate.publicKey?.toString() || '0').slice(-4).toUpperCase()}</span>
                  </div>
                </div>

                <div className="z-10 py-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    {verifiedCertificate.account.courseName}
                  </h2>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                    This certifies that the recipient has successfully completed the rigorous curriculum and demonstrated mastery in Solana&apos;s Sealevel runtime and Rust-based program development.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30 flex items-center justify-center bg-white/5 text-primary">
                      <span className="material-symbols-outlined text-2xl">account_circle</span>
                    </div>
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant block">AWARDED TO</span>
                      <span className="font-headline-md text-lg font-bold text-on-surface">{verifiedCertificate.account.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end z-10 border-t border-white/5 pt-4">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant">ISSUE DATE</span>
                    <span className="font-body-md text-xs text-on-surface">
                      {new Date(verifiedCertificate.account.issueDate.toNumber() * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-white/5 p-2 rounded-lg mb-1 border border-white/5">
                      <span className="material-symbols-outlined text-white text-xl">qr_code_2</span>
                    </div>
                    <span className="font-label-caps text-[10px] text-on-surface-variant">SECURE QR CODE</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="glass-surface px-6 py-3 rounded-lg flex items-center gap-2 text-xs font-semibold text-on-surface hover:bg-white/10 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-primary text-lg">download</span>
                  Print / Download PDF
                </button>
              </div>
            </div>

            {/* Right: Technical Details Panel */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="glass-surface rounded-xl p-6 space-y-6">
                <h3 className="font-title-sm text-sm font-bold text-primary mb-4 border-b border-white/5 pb-2">Credential Details</h3>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-[10px] text-on-surface-variant font-semibold">RECIPIENT</span>
                      <span className="font-body-lg text-sm text-on-surface font-semibold">{verifiedCertificate.account.name}</span>
                    </div>
                    <div className="flex flex-col items-end text-right">
                      <span className="font-label-caps text-[10px] text-on-surface-variant font-semibold">ISSUE DATE</span>
                      <span className="font-body-lg text-sm text-on-surface">
                        {new Date(verifiedCertificate.account.issueDate.toNumber() * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant font-semibold">ISSUING AUTHORITY</span>
                    <span className="font-body-lg text-sm text-on-surface font-semibold">VerifyCertify Protocol Issuer</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant font-semibold">ON-CHAIN PUBLIC KEY</span>
                    <div
                      onClick={() => handleCopyHash(verifiedCertificate.publicKey?.toString() || '')}
                      className="bg-surface-container-highest/50 p-3 rounded-lg mt-1 flex justify-between items-center group cursor-pointer hover:bg-surface-container-highest transition-colors border border-white/5"
                    >
                      <code className="font-mono text-[11px] text-primary truncate mr-4">
                        {verifiedCertificate.publicKey?.toString() || 'Loading...'}
                      </code>
                      <span className="material-symbols-outlined text-on-surface-variant text-sm group-hover:text-primary">
                        {copied ? 'check' : 'content_copy'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs">
                    <div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant font-semibold">STATUS</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]"></span>
                        <span className="font-body-md text-secondary font-bold uppercase text-[10px]">Verified</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-label-caps text-[10px] text-on-surface-variant font-semibold">LEDGER PROTOCOL</span>
                      <span className="font-body-md text-on-surface mt-1 font-bold">SOLANA v1.0</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://explorer.solana.com/address/${verifiedCertificate.publicKey?.toString()}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-6 bg-primary py-3 rounded-xl font-bold text-xs tracking-wider text-on-primary flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 text-center"
                >
                  <span className="material-symbols-outlined text-lg">explore</span>
                  View on Solana Explorer
                </a>
              </div>

              {/* Cryptographic Proof Explainer */}
              <div className="glass-surface rounded-xl p-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/5 rounded-full blur-3xl" />
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/20 p-2 rounded-lg text-secondary">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  </div>
                  <div>
                    <h4 className="font-title-sm text-sm font-bold text-on-surface mb-1">Cryptographic Proof</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      This certificate metadata is permanently anchored on the Solana ledger. Any alteration attempts break the cryptographic signatures, rendering fake copies invalid immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="border border-red-500/20 bg-red-500/5 text-red-200 rounded-2xl p-6 md:p-8">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                  <span className="material-symbols-outlined text-red-500 text-3xl">cancel</span>
                </div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Credential Verification Failed</h2>
                <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                  No transaction or credential matching the provided signatures was detected on the ledger. 
                  Please confirm the link query parameters are correct or request a reissue.
                </p>
                
                <div className="bg-white/5 rounded-xl p-4 text-left border border-white/5 text-xs space-y-2">
                  <h3 className="font-semibold text-on-surface uppercase tracking-wider font-label-caps">Search Details:</h3>
                  <div className="grid grid-cols-2 gap-2 text-on-surface-variant font-mono">
                    <span className="font-semibold text-[10px]">COURSE IDENTIFIER:</span>
                    <span className="truncate">{courseId}</span>
                    <span className="font-semibold text-[10px]">LEARNER IDENTIFIER:</span>
                    <span className="truncate">{learnerId}</span>
                    <span className="font-semibold text-[10px]">LEDGER STATUS:</span>
                    <span className="text-red-400 font-bold">NOT_FOUND</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
import { LoadingPage } from '@/components/ui/loading-spinner'
import { fetchLearner } from '../lib/data'
import CertificatesWrapper from '@/components/dashboard/CertificatesWrapper'
import { Suspense } from 'react'

export default async function LearnersDashboard() {
  const response = await fetchLearner()
  const { data } = response

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="min-h-screen bg-surface text-on-surface font-body-md overflow-x-hidden relative pt-20">
        <div className="max-w-container-max mx-auto p-md md:p-lg">
          {/* Welcome Banner */}
          <div className="mb-xl">
            <div className="glass-surface rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-3xl rounded-full"></div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 z-10 relative">
                <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center border border-primary/30">
                  <span className="material-symbols-outlined text-primary text-3xl">school</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                    Welcome, {data?.user?.learnerName || 'Learner'}!
                  </h1>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Track your learning achievements and manage your decentralised certificates on Solana.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-xl">
            <div className="glass-surface p-md rounded-xl space-y-xs flex flex-col justify-between neon-glow">
              <p className="font-label-caps text-on-surface-variant text-[11px] uppercase tracking-widest font-semibold">
                AFFILIATED INSTITUTION
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-primary">corporate_fare</span>
                <span className="font-title-sm text-lg font-semibold text-on-surface">
                  {data?.user?.organizationName || 'Not Affiliated'}
                </span>
              </div>
            </div>
            <div className="glass-surface p-md rounded-xl space-y-xs flex flex-col justify-between neon-glow">
              <p className="font-label-caps text-on-surface-variant text-[11px] uppercase tracking-widest font-semibold">
                VERIFICATION REGION
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-secondary">explore</span>
                <span className="font-title-sm text-lg font-semibold text-on-surface">
                  Solana Mainnet-Beta
                </span>
              </div>
            </div>
          </div>

          {/* Columns Layout */}
          <div className="flex flex-col lg:flex-row gap-lg">
            {/* Left: Certificates Grid */}
            <div className="flex-grow">
              {data?.user?._id && <CertificatesWrapper userId={data?.user?._id.toString()} />}
            </div>

            {/* Right: Sidebar Widgets */}
            <div className="w-full lg:w-80 space-y-md shrink-0">
              {/* Solana Helper */}
              <div className="glass-surface p-md rounded-xl space-y-4 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
                <h3 className="font-title-sm text-primary flex items-center gap-2 font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">help_center</span>
                  Why Solana?
                </h3>
                <p className="text-xs leading-relaxed text-on-surface-variant">
                  Solana provides high-velocity transactions and enterprise security. Your achievements are cryptographically secured on a global ledger.
                </p>
                <div className="space-y-3 mt-4">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-primary">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-on-surface">Fast &amp; Cheap</p>
                      <p className="text-[10px] text-on-surface-variant leading-normal">Verify credentials in milliseconds for sub-cent fees.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-primary">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-on-surface">Immutable</p>
                      <p className="text-[10px] text-on-surface-variant leading-normal">Once minted, your credential cannot be altered or deleted.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="glass-surface p-md rounded-xl space-y-4">
                <h3 className="font-title-sm text-secondary flex items-center gap-2 font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                  How it works
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your credentials contain cryptographic signatures that verify identity. Verification is fully decentralized.
                </p>
                <ul className="text-[10px] space-y-1 list-disc list-inside text-on-surface-variant/80">
                  <li>Instant check via scan or link</li>
                  <li>Tamper-proof signatures</li>
                  <li>Permanent public registry</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
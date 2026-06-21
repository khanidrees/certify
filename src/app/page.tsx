import Link from 'next/link'
import { ShaderCanvas } from '@/components/ui/shader-canvas'

export default function Home() {
  return (
    <div className="flex-grow min-h-screen bg-surface text-on-surface font-body-md overflow-x-hidden relative pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        {/* WebGL Grid Background */}
        <div className="absolute inset-0 w-full h-full opacity-40">
          <ShaderCanvas />
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-md text-center py-20">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-gradient drop-shadow-[0_0_30px_rgba(173,198,255,0.3)] mb-md">
            VerifyCertify
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-lg">
            The Secure, Blockchain-Powered Standard for Digital Credentials on Solana.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-base">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#3B82F6] text-white font-title-sm text-title-sm px-xl py-base rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 transition-transform">
                Get Started
              </button>
            </Link>
            <Link href="/public/course/demo/learner/demo" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto glass-surface text-on-surface font-title-sm text-title-sm px-xl py-base rounded-xl hover:bg-white/10 transition-colors">
                View Demo Certificate
              </button>
            </Link>
          </div>

          {/* Dynamic Stats */}
          <div className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="glass-surface p-md rounded-xl neon-glow">
              <div className="text-secondary font-display-lg text-display-lg-mobile">100k+</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Secured</div>
            </div>
            <div className="glass-surface p-md rounded-xl neon-glow">
              <div className="text-primary font-display-lg text-display-lg-mobile">0.4s</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Verification</div>
            </div>
            <div className="glass-surface p-md rounded-xl neon-glow">
              <div className="text-tertiary font-display-lg text-display-lg-mobile">∞</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Lifetime Storage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-xl bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-md">
          <h2 className="font-headline-md text-headline-md text-center mb-xl">Enterprise-Grade Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
            {/* Blockchain Security Card */}
            <div className="md:col-span-7 glass-surface p-lg rounded-xl relative overflow-hidden group">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-secondary text-4xl mb-base block">security</span>
                <h3 className="font-title-sm text-title-sm mb-base">Blockchain Security</h3>
                <p className="text-on-surface-variant font-body-md">
                  Immutable record-keeping on the Solana network ensures that every certificate issued is tamper-proof and verifiable by anyone, anywhere in the world instantly.
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              </div>
            </div>

            {/* Easy Issuance Card */}
            <div className="md:col-span-5 glass-surface p-lg rounded-xl group">
              <span className="material-symbols-outlined text-primary text-4xl mb-base block">bolt</span>
              <h3 className="font-title-sm text-title-sm mb-base">Easy Issuance</h3>
              <p className="text-on-surface-variant font-body-md">
                Streamlined dashboard for institutions to mint hundreds of credentials in seconds with automated wallet integration.
              </p>
            </div>

            {/* Multi-Role System Card */}
            <div className="md:col-span-5 glass-surface p-lg rounded-xl group">
              <span className="material-symbols-outlined text-tertiary text-4xl mb-base block">groups</span>
              <h3 className="font-title-sm text-title-sm mb-base">Multi-Role System</h3>
              <p className="text-on-surface-variant font-body-md">
                Distinct interfaces for Issuers, Earners, and Verifiers, each optimized for their specific workflow and security requirements.
              </p>
            </div>

            {/* Privacy Card */}
            <div className="md:col-span-7 glass-surface p-lg rounded-xl relative overflow-hidden group">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-4xl mb-base block">fingerprint</span>
                <h3 className="font-title-sm text-title-sm mb-base">Privacy Preserving</h3>
                <p className="text-on-surface-variant font-body-md">
                  Zero-knowledge proof compatibility allows users to prove credentials without revealing sensitive personal data, maintaining full sovereign identity control.
                </p>
              </div>
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none">
                <img 
                  className="object-cover h-full" 
                  alt="Pattern" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8tHTiF5kcWmlmSyTlQg7U_fpUu9XdfTDvFGMTgnu8n58F4iOEhq3UA4BE8xWPpHJe9t--ipCQregHWtFpijh0cqN3Pzfj2X8Nz-w5Iux2EHxn2MrSZ6lGAPTy-1i_QMqOPzCFQg_QpaXjzqlVpo3dgXq0CKuT-dXVIZShw7V_QFzhiHmO9FzGVhlmKklnEfmiTubvHDsrKOEjXBKGPqqaw0NGhZGQR2-wktAjGbCqfH2sPxP9y5ALrVkIxPK-ff8CB1JrisNwNOKb"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Timeline */}
      <section className="py-xl">
        <div className="max-w-container-max mx-auto px-md">
          <h2 className="font-headline-md text-headline-md text-center mb-xl">Simple Verification Flow</h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-outline-variant/30 md:-translate-x-1/2"></div>
            <div className="space-y-xl">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-1 md:text-right md:pr-xl mb-base md:mb-0">
                  <h4 className="font-title-sm text-title-sm text-primary mb-xs">Step 1</h4>
                  <h3 className="font-headline-md text-headline-md mb-xs">Connect Wallet</h3>
                  <p className="text-on-surface-variant max-w-sm ml-auto">
                    Establish your identity securely using Solana&apos;s leading wallet providers like Phantom or Solflare.
                  </p>
                </div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10 md:-translate-x-1/2 shadow-[0_0_15px_rgba(173,198,255,0.6)]">
                  <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                </div>
                <div className="flex-1 md:pl-xl"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-1 md:pr-xl"></div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center z-10 md:-translate-x-1/2 shadow-[0_0_15px_rgba(78,222,163,0.6)]">
                  <span className="material-symbols-outlined text-on-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                </div>
                <div className="flex-1 md:pl-xl mb-base md:mb-0">
                  <h4 className="font-title-sm text-title-sm text-secondary mb-xs">Step 2</h4>
                  <h3 className="font-headline-md text-headline-md mb-xs">Issue or Earn</h3>
                  <p className="text-on-surface-variant max-w-sm">
                    Institutions mint certificates as compressed NFTs, while earners receive them instantly in their dashboard.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-1 md:text-right md:pr-xl mb-base md:mb-0">
                  <h4 className="font-title-sm text-title-sm text-tertiary mb-xs">Step 3</h4>
                  <h3 className="font-headline-md text-headline-md mb-xs">Verify on Solscan</h3>
                  <p className="text-on-surface-variant max-w-sm ml-auto">
                    Third parties can verify the certificate&apos;s authenticity directly through the public ledger with a single click.
                  </p>
                </div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-tertiary flex items-center justify-center z-10 md:-translate-x-1/2 shadow-[0_0_15px_rgba(76,215,246,0.6)]">
                  <span className="material-symbols-outlined text-on-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <div className="flex-1 md:pl-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-xl relative">
        <div className="max-w-container-max mx-auto px-md">
          <div className="glass-surface p-xl rounded-xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 animate-pulse-slow"></div>
            <div className="relative z-10">
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-md">Ready to Certify the Future?</h2>
              <p className="text-on-surface-variant font-body-lg mb-lg max-w-2xl mx-auto">
                Join hundreds of enterprises and universities moving their credential ecosystem to the Solana blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-base justify-center">
                <Link href="/auth/signup">
                  <button className="bg-primary text-on-primary font-title-sm text-title-sm px-xl py-base rounded-xl shadow-lg hover:brightness-110 transition-all">
                    Start Issuing Now
                  </button>
                </Link>
                <button className="glass-surface text-on-surface font-title-sm text-title-sm px-xl py-base rounded-xl border border-primary/20 hover:border-primary transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
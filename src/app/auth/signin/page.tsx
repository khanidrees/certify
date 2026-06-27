'use client'

import { Input } from '@/components/ui/input'
import { useActionState, useEffect, useState } from 'react'
import { signIn, SignInState } from '@/app/lib/actions'
import { useRouter, useSearchParams } from 'next/navigation'
import GoogleSignInButton from '@/components/GoogleSignInButton'

const initialState: SignInState = {
  message: '',
  errors: {},
  status: 0,
}

export default function SignInPage() {
  const [userType, setUserType] = useState<'learner' | 'org'>('org')
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  })
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({})
  const [state, formAction] = useActionState(signIn, initialState)
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handlePrefill = (role: 'org' | 'learner') => {
    setUserType(role)
    if (role === 'org') {
      setFormValues({
        username: 'org@prod.test',
        password: 'Org@ProdTest1',
      })
    } else {
      setFormValues({
        username: 'learner@prod.test',
        password: 'Learner@ProdTest1',
      })
    }
    setClientErrors({})
  }

  useEffect(() => {
    if (state?.status === 200) {
      router.refresh()
    }
  }, [state, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setClientErrors((prev) => ({
      ...prev,
      [e.target.name]: [],
    }))
  }

  const validate = () => {
    const errors: Record<string, string[]> = {}

    if (!formValues.username.trim()) {
      errors.username = ['Email address is required.']
    }

    if (!formValues.password) {
      errors.password = ['Password is required.']
    }

    setClientErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!validate()) {
      e.preventDefault()
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md overflow-x-hidden relative flex flex-col justify-between">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-md py-base flex justify-between items-center bg-transparent">
        <div className="flex items-center space-x-xs cursor-pointer" onClick={() => router.push('/')}>
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">VerifyCertify</h1>
        </div>
      </header>

      <main className="flex h-screen w-full pt-16">
        {/* Left Side: Illustration */}
        <section className="hidden md:flex relative w-1/2 h-full bg-surface-container-lowest overflow-hidden items-center justify-center border-r border-white/5">
          <div className="absolute -inset-20 neon-bloom animate-pulse-soft opacity-40"></div>
          <div className="relative z-10 w-full max-w-lg p-lg space-y-md">
            <div className="relative">
              {/* Graphic Card 1 */}
              <div className="glass-surface rounded-xl p-md transform -rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="flex justify-between items-start mb-md">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">workspace_premium</span>
                  </div>
                  <span className="font-label-caps text-xs text-secondary px-3 py-1 bg-secondary/10 rounded-full font-semibold">SOLANA VERIFIED</span>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-on-surface-variant/20 rounded"></div>
                  <div className="h-4 w-1/2 bg-on-surface-variant/20 rounded"></div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <div className="text-[10px] font-mono text-on-surface-variant/40">HASH: 0x72a...9b4f</div>
                  <div className="h-8 w-8 rounded bg-primary/10"></div>
                </div>
              </div>
              {/* Graphic Card 2 */}
              <div className="absolute top-1/2 -right-8 glass-surface rounded-xl p-4 w-48 shadow-2xl transform rotate-6 translate-y-4 hover:translate-y-0 transition-transform duration-700 delay-100">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="material-symbols-outlined text-tertiary text-sm">shield</span>
                  <span className="font-label-caps text-[10px] text-tertiary font-semibold">ENCRYPTED</span>
                </div>
                <div className="h-2 w-full bg-tertiary/10 rounded mb-2"></div>
                <div className="h-2 w-2/3 bg-tertiary/10 rounded"></div>
              </div>
            </div>
            <div className="pt-8 text-left">
              <h2 className="font-display-lg text-3xl lg:text-4xl text-on-surface leading-tight font-bold mb-4">Instant Access. Total Control.</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
                Access and share your verified credentials instantly. We handle the blockchain security in the background, so you can focus on your career.
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Form */}
        <section className="w-full md:w-1/2 h-full relative flex items-center justify-center p-md">
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>
          <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-secondary/5 blur-3xl rounded-full"></div>
          
          <div className="w-full max-w-md space-y-6 z-10">
            <div className="text-center md:text-left">
              <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-1">Secure Access</h3>
              <p className="font-body-md text-sm text-on-surface-variant">Sign in to manage your decentralized credentials.</p>
            </div>

            <div className="glass-surface rounded-xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              {/* Identity Role Toggle */}
              <div className="relative">
                <label className="font-label-caps text-xs text-on-surface-variant mb-2 block font-semibold">IDENTITY ROLE</label>
                <div className="flex p-1 bg-surface-container-highest rounded-lg border border-white/5">
                  <button
                    type="button"
                    onClick={() => setUserType('learner')}
                    className={`flex-1 py-2 px-4 rounded-md text-xs font-semibold tracking-wider transition-all duration-300 ${
                      userType === 'learner'
                        ? 'bg-primary-container/20 text-primary font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    LEARNER
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('org')}
                    className={`flex-1 py-2 px-4 rounded-md text-xs font-semibold tracking-wider transition-all duration-300 ${
                      userType === 'org'
                        ? 'bg-primary-container/20 text-primary font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    ORGANIZATION
                  </button>
                </div>
              </div>

              {/* Form */}
              <form action={formAction} onSubmit={handleSubmit} className="space-y-4" noValidate>
                <input type="hidden" name="userType" value={userType} />

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="font-label-caps text-xs text-on-surface-variant font-semibold" htmlFor="username">EMAIL ADDRESS</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-lg">alternate_email</span>
                    <Input
                      id="username"
                      name="username"
                      type="email"
                      value={formValues.username}
                      onChange={handleChange}
                      placeholder="name@enterprise.com"
                      className="w-full bg-surface-container-lowest border border-white/10 rounded-lg pl-10 pr-4 py-3 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all h-12"
                    />
                  </div>
                  {clientErrors.username?.map((error) => (
                    <p key={error} className="text-xs text-red-500 mt-1">{error}</p>
                  ))}
                  {state?.errors?.username?.map((error: string) => (
                    <p key={error} className="text-xs text-red-600 mt-1">{error}</p>
                  ))}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="font-label-caps text-xs text-on-surface-variant font-semibold" htmlFor="password">PASSWORD</label>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-lg">lock</span>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formValues.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-surface-container-lowest border border-white/10 rounded-lg pl-10 pr-4 py-3 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all h-12"
                    />
                  </div>
                  {clientErrors.password?.map((error) => (
                    <p key={error} className="text-xs text-red-500 mt-1">{error}</p>
                  ))}
                  {state?.errors?.password?.map((error: string) => (
                    <p key={error} className="text-xs text-red-600 mt-1">{error}</p>
                  ))}
                </div>

                {/* Message errors */}
                {state?.message && (
                  <div className="mt-4 p-3 rounded-lg text-center text-xs bg-red-900/20 text-red-200 border border-red-500/20">
                    {state.message}
                  </div>
                )}
                {error && (
                  <div className="mt-4 p-3 bg-red-900/20 text-red-200 rounded-lg text-center text-xs border border-red-500/20">
                    {error === 'not_approved' ? 'Your account is not approved yet.' : 'An error occurred during sign-in.'}
                  </div>
                )}

                <button type="submit" className="w-full h-12 bg-primary text-on-primary font-bold py-3 rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center space-x-2">
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>

                {userType === 'learner' ? (
                  <p className="text-xs text-amber-500 text-center mt-2 leading-relaxed">
                    Learners can Sign In Through Credentials Only. Please contact your organization.
                  </p>
                ) : (
                  <>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-[10px]">
                        <span className="px-2 bg-[#1C1F2A] text-on-surface-variant uppercase font-label-caps tracking-widest">Or continue with</span>
                      </div>
                    </div>

                    <GoogleSignInButton
                      callbackUrl="/dashboard"
                      className="w-full h-12 bg-surface-container-highest/50 hover:bg-surface-container-highest border border-white/5 text-on-surface py-3 rounded-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                    />
                  </>
                )}
              </form>

              {/* Demo Accounts */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-2 bg-[#1C1F2A] text-on-surface-variant uppercase font-label-caps tracking-widest">Demo Accounts</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handlePrefill('org')}
                  className="flex flex-col items-center justify-center p-3 bg-surface-container-lowest/50 border border-white/10 rounded-lg hover:bg-primary/10 hover:border-primary/30 transition-all text-center group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary text-xl mb-1 group-hover:scale-110 transition-transform">corporate_fare</span>
                  <span className="font-semibold text-xs text-on-surface">Organization</span>
                  <span className="text-[10px] text-on-surface-variant/50 font-mono mt-0.5">org@prod.test</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePrefill('learner')}
                  className="flex flex-col items-center justify-center p-3 bg-surface-container-lowest/50 border border-white/10 rounded-lg hover:bg-secondary/10 hover:border-secondary/30 transition-all text-center group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary text-xl mb-1 group-hover:scale-110 transition-transform">school</span>
                  <span className="font-semibold text-xs text-on-surface">Learner</span>
                  <span className="text-[10px] text-on-surface-variant/50 font-mono mt-0.5">learner@prod.test</span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="font-body-md text-xs text-on-surface-variant">
                New to VerifyCertify?{' '}
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="text-primary font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

'use client'
import { signUp, SignUpState } from '@/app/lib/actions'
import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import GoogleSignInButton from '@/components/GoogleSignInButton'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupPage() {
  const initialState: SignUpState = {
    message: '',
    errors: {},
    status: 0
  }
  const [userType, setUserType] = useState<'learner' | 'org'>('org')
  const [showPassword, setShowPassword] = useState(false)
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({})
  const [formValues, setFormValues] = useState({
    organizationName: '',
    username: '',
    password: ''
  })
  const [state, formAction] = useActionState(signUp, initialState)
  const router = useRouter()

  // Handle controlled input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setClientErrors((prev) => ({
      ...prev,
      [e.target.name]: []
    }))
  }

  // Client-side validation function
  const validate = () => {
    const errors: Record<string, string[]> = {}

    if (userType === 'org') {
      if (!formValues.organizationName.trim()) {
        errors.organizationName = ['Organization name is required.']
      } else if (formValues.organizationName.trim().length < 3) {
        errors.organizationName = ['Organization name must be at least 3 characters.']
      }
    }

    if (!formValues.username.trim()) {
      errors.username = ['Email address is required.']
    } else if (!emailRegex.test(formValues.username.trim())) {
      errors.username = ['Please enter a valid email address.']
    }

    if (!formValues.password) {
      errors.password = ['Password is required.']
    } else if (formValues.password.length < 6) {
      errors.password = ['Password must be at least 6 characters.']
    }

    setClientErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!validate()) {
      e.preventDefault();
    }
  }

  // Micro-interaction logic for icons
  useEffect(() => {
    const inputs = document.querySelectorAll('input');

    const handleFocus = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const icon = input.parentElement?.querySelector('.material-symbols-outlined') as HTMLElement;
      if (icon && input.type !== 'radio') {
        icon.style.color = '#3b82f6';
        icon.style.fontVariationSettings = "'FILL' 1";
      }
    }
    const handleBlur = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const icon = input.parentElement?.querySelector('.material-symbols-outlined') as HTMLElement;
      if (icon && input.type !== 'radio') {
        icon.style.color = '#8c909f';
        icon.style.fontVariationSettings = "'FILL' 0";
      }
    }

    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface relative dark">
      {/* Background FX */}
      <div className="fixed inset-0 grid-background -z-10"></div>
      <div className="cyber-orb top-[-20%] left-[-10%]"></div>
      <div className="cyber-orb bottom-[-20%] right-[-10%]" style={{ background: 'radial-gradient(circle, rgba(78, 222, 163, 0.05) 0%, rgba(78, 222, 163, 0) 70%)' }}></div>

      {/* Main Registration Section */}
      <main className="flex-grow flex items-center justify-center p-md my-xl">
        <div className="w-full max-w-[480px] z-10">
          {/* Glassmorphic Card */}
          <div className="glass-surface rounded-xl p-lg space-y-md border border-white/10 shadow-2xl">

            {/* Header Section */}
            <div className="text-center space-y-sm">
              <h1 className="font-display-lg text-display-lg-mobile md:text-[40px] md:leading-[48px] gradient-text font-bold">Create an Account</h1>
              <p className="font-body-lg text-on-surface-variant">Join the secure verification standard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} action={formAction} className="space-y-md pt-base" noValidate>

              {/* User Type Selection */}
              <div className="flex flex-col gap-sm py-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant px-xs">I am registering as:</label>
                <div className="flex gap-4 px-xs">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input
                        type="radio"
                        name="userType"
                        value="learner"
                        checked={userType === 'learner'}
                        onChange={() => setUserType('learner')}
                        className="peer appearance-none w-5 h-5 border border-outline rounded-full bg-surface-container-low checked:border-[#3b82f6] checked:bg-[#3b82f6]/10 focus:ring-1 focus:ring-[#3b82f6]/50 focus:outline-none transition-all duration-200"
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#3b82f6] scale-0 peer-checked:scale-100 transition-transform duration-200 pointer-events-none"></div>
                    </div>
                    <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">Learner</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input
                        type="radio"
                        name="userType"
                        value="org"
                        checked={userType === 'org'}
                        onChange={() => setUserType('org')}
                        className="peer appearance-none w-5 h-5 border border-outline rounded-full bg-surface-container-low checked:border-[#3b82f6] checked:bg-[#3b82f6]/10 focus:ring-1 focus:ring-[#3b82f6]/50 focus:outline-none transition-all duration-200"
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#3b82f6] scale-0 peer-checked:scale-100 transition-transform duration-200 pointer-events-none"></div>
                    </div>
                    <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">Organization</span>
                  </label>
                </div>
              </div>

              {userType === 'learner' && (
                <div className="p-sm bg-error-container/20 border border-error/20 rounded-lg text-sm text-error/90 text-center">
                  Learners cannot register. Please contact your organization.
                </div>
              )}

              {userType === 'org' && (
                <div className="space-y-xs">
                  <label htmlFor="organizationName" className="font-label-caps text-label-caps text-on-surface-variant px-xs">Organization Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">domain</span>
                    <input
                      id="organizationName"
                      name="organizationName"
                      value={formValues.organizationName}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border border-white/10 rounded-lg py-3 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-0 focus:outline-none input-focus-glow transition-all duration-300"
                      placeholder="Enterprise Corp"
                      type="text"
                    />
                  </div>
                  {clientErrors.organizationName?.map((error) => (
                    <p key={error} className="text-xs text-error mt-1 px-xs">{error}</p>
                  ))}
                  {state?.errors?.organizationName?.map((error: string) => (
                    <p key={error} className="text-xs text-error mt-1 px-xs">{error}</p>
                  ))}
                </div>
              )}

              <div className="space-y-xs">
                <label htmlFor="username" className="font-label-caps text-label-caps text-on-surface-variant px-xs">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                  <input
                    id="username"
                    name="username"
                    value={formValues.username}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-white/10 rounded-lg py-3 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-0 focus:outline-none input-focus-glow transition-all duration-300"
                    placeholder="name@enterprise.com"
                    type="email"
                  />
                </div>
                {clientErrors.username?.map((error) => (
                  <p key={error} className="text-xs text-error mt-1 px-xs">{error}</p>
                ))}
                {state?.errors?.username?.map((error: string) => (
                  <p key={error} className="text-xs text-error mt-1 px-xs">{error}</p>
                ))}
              </div>

              <div className="space-y-xs">
                <label htmlFor="password" className="font-label-caps text-label-caps text-on-surface-variant px-xs">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formValues.password}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-white/10 rounded-lg py-3 pl-12 pr-12 text-on-surface placeholder:text-outline/50 focus:ring-0 focus:outline-none input-focus-glow transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {clientErrors.password?.map((error) => (
                  <p key={error} className="text-xs text-error mt-1 px-xs">{error}</p>
                ))}
                {state?.errors?.password?.map((error: string) => (
                  <p key={error} className="text-xs text-error mt-1 px-xs">{error}</p>
                ))}
              </div>

              {/* General message */}
              {state?.message && (
                <div
                  className={`mt-4 p-sm rounded-lg text-center text-sm border ${state.status === 200 || state.status === 201
                      ? 'bg-secondary-container/20 border-secondary/20 text-secondary'
                      : 'bg-error-container/20 border-error/20 text-error'
                    }`}
                >
                  {state.message}
                </div>
              )}

              {/* Primary CTA */}
              <button
                type="submit"
                disabled={userType === 'learner'}
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-title-sm py-4 rounded-lg neon-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-base shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 disabled:active:scale-100"
              >
                Sign Up
              </button>

              {/* Divider */}
              <div className="flex items-center gap-sm py-xs">
                <div className="h-[1px] flex-1 bg-white/10"></div>
                <span className="font-label-caps text-label-caps text-outline">OR</span>
                <div className="h-[1px] flex-1 bg-white/10"></div>
              </div>

              {/* Web3 Integration */}
              {/* <button type="button" className="w-full bg-surface-container-low border border-white/10 hover:border-[#3b82f6]/50 text-on-surface font-title-sm py-3.5 rounded-lg flex items-center justify-center gap-sm transition-all duration-300 group hover:bg-surface-container">
                  <div className="w-5 h-5 bg-contain bg-center bg-no-repeat grayscale group-hover:grayscale-0 transition-all duration-300" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBG6Seix0bQs9Fus-nu1AW1CP1MXdM-PUHtJE5Xu_0o0jK-GUp49b6XdmwvZDep1qolvGhj-XoyG-71nw-4waWXQnm8FBv86QWwqsDf_S2qxL2SRsNBQRs9eU2zy2jH3a7xCL6FNLOYvXFOyu68Ci0k7Qrutrwly9LWT5dgrDSGeo3xdRmAraRqMmfk2ElJ5ZMIV8mdObZ7g3kLcIAyolo7kowkX6YLVAgZRM3N3pfBpVHhjSX7DuFz2tpAVIHYgXuXd9nbtlQR7idr')"}}></div>
                  <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">Continue with Solana Wallet</span>
              </button> */}

              <div className="w-full">
                <GoogleSignInButton className="w-full bg-surface-container-low border border-white/10 hover:border-[#3b82f6]/50 text-on-surface font-title-sm py-3.5 rounded-lg flex items-center justify-center gap-sm transition-all duration-300 group hover:bg-surface-container mt-2" />
              </div>

            </form>

            {/* Footer Links */}
            <div className="pt-sm text-center">
              <p className="font-body-md text-on-surface-variant">
                Already have an account?
                <button onClick={() => router.push('/auth/signin')} className="text-secondary hover:text-secondary-fixed transition-colors font-semibold ml-1 underline underline-offset-4 decoration-secondary/30 bg-transparent border-none cursor-pointer">Log In</button>
              </p>
            </div>

          </div>

          {/* Security Disclaimer */}
          <div className="mt-md text-center">
            <div className="flex items-center justify-center gap-xs text-outline mb-xs opacity-60">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              <span className="font-label-caps text-[10px] tracking-widest uppercase">Military Grade Encryption</span>
            </div>
            <p className="font-label-caps text-[10px] text-outline/60 leading-relaxed px-lg">
              By signing up, you agree to our <a href="#" className="hover:text-primary transition-colors underline">Terms of Service</a> and <a href="#" className="hover:text-primary transition-colors underline">Privacy Policy</a>.
              <br />Credential integrity secured on Solana Mainnet.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useActionState, useEffect, useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { signIn, SignInState } from '@/app/lib/actions'
import { useRouter } from 'next/navigation'


const initialState: SignInState = {
  message: '',
  errors: {},
  status: 0,
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  })
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({})
  const [state, formAction] = useActionState(signIn, initialState)
  const router = useRouter();

  useEffect(() => {
    if(state?.status === 200) {
      // Redirect to dashboard on successful sign-in
      router.refresh();
    }
  }, [state, router]);

  // Handle controlled input changes
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

  // Client-side validation
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

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    if (!validate()) {
      e.preventDefault();
    }
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">VC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your VerifyCertify account
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur dark:bg-gray-800/80">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <Input
                  id="username"
                  name="username"
                  type="email"
                  value={formValues.username}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="h-12"
                />
                {clientErrors.username?.map((error) => (
                  <p key={error} className="text-sm text-red-500 mt-1">{error}</p>
                ))}
                {state?.errors?.username?.map((error: string) => (
                  <p key={error} className="text-sm text-red-600 mt-1">{error}</p>
                ))}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formValues.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {clientErrors.password?.map((error) => (
                  <p key={error} className="text-sm text-red-500 mt-1">{error}</p>
                ))}
                {state?.errors?.password?.map((error: string) => (
                  <p key={error} className="text-sm text-red-600 mt-1">{error}</p>
                ))}
              </div>

              {/* General message */}
              {state?.message && (
                <div
                  className={`mt-4 p-4 rounded-lg text-center text-sm ${
                    state.status === 200 || state.status === 201
                      ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                      : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                  }`}
                >
                  {state.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </button>
            </form>

            {/* Navigation to signup */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => router.push('/auth/signup')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Need an organization account?
              </button>
            </div>

            {/* Informational message (can adjust or remove) */}
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200 text-center">
                <strong>Note:</strong> Sign in to access organization features.
                <br /><br />
                <span className="font-semibold">If you don’t have an account, register your organization first.</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

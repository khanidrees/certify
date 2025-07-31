'use client'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { signUp, SignUpState } from '@/app/lib/actions'
import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupPage() {
  const initialState: SignUpState = {
    message: '',
    errors: {},
    status: 0
  }

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

    if (!formValues.organizationName.trim()) {
      errors.organizationName = ['Organization name is required.']
    } else if (formValues.organizationName.trim().length < 3) {
      errors.organizationName = ['Organization name must be at least 3 characters.']
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
    e.preventDefault()
    if (validate()) {
      setClientErrors({})
      // Call your Next.js formAction
      const target = e.target as HTMLFormElement;
      const formData = new FormData(target);
      await formAction(formData);
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
            Create Organization Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your VerifyCertify account
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur dark:bg-gray-800/80">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Organization Registration
            </CardTitle>
            <CardDescription className="text-center">
              Submit your organization details for approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Disable native validation for custom validation control */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Organization Name */}
              <div className="space-y-2">
                <label
                  htmlFor="organizationName"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Organization Name
                </label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  value={formValues.organizationName}
                  onChange={handleChange}
                  placeholder="Enter your organization name"
                  className="h-12"
                />
                {/* Client errors */}
                {clientErrors.organizationName?.map((error) => (
                  <p key={error} className="text-sm text-red-500 mt-1">{error}</p>
                ))}
                {/* Server errors */}
                {state?.errors?.organizationName?.map((error: string) => (
                  <p key={error} className="text-sm text-red-600 mt-1">{error}</p>
                ))}
              </div>

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
                Submit Request
              </button>
            </form>

            {/* Navigation to sign-in */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => router.push('/auth/signin')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Already have an account?
              </button>
            </div>

            {/* Informational message */}
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200 text-center">
                <strong>Note:</strong> Organization registration requires admin approval.
                <br /><br />
                <span className="font-semibold">For learner credentials, contact your organization directly.</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

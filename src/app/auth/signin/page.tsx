'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useActionState, useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { signIn, SignInState } from '@/app/lib/actions'
// import { toast } from 'sonner'

type Role = 'organization';

const initalState: SignInState = {
  message : '',
  errors : {},
  status: 0
};

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(signIn, initalState);
  
  if(state?.status === 200) {
    window.location.href = '/';
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
            <form action={formAction}  className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <Input
                  name="username"
                  placeholder="Enter your email"
                  type='text'
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div id="org-name-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.username &&
                  state?.errors.username.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>

              {state?.message && (
              <div className={`mt-4 p-4 rounded-lg text-center text-sm ${
                state?.status == 200 || state?.status == 201
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                  : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'
              }`}>
                {state?.message}
              </div>
              )}

              <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="submit"
      
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Need an organization account?
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
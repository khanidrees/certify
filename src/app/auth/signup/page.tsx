'use client'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { LoadingSpinner } from '@/components/ui/loading-spinner'
// import { useState, ChangeEvent, FormEvent } from 'react'
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
// import { toast } from 'sonner';
import { signUp, SignUpState } from '@/app/lib/actions'
import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation';



export default function SignupPage() {
  const initalState: SignUpState = {
    message : '',
    errors : {},
    status: 0
  }
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction] = useActionState(signUp, initalState)
  const router = useRouter();
  
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
            <form action={formAction} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Organization Name
                </label>
                <Input
                  type="text"
                  name="organizationName"
                  placeholder="Enter your organization name"
                  required
                  className="h-12"
                />
              </div>
              <div id="org-name-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.OrganizationName &&
                  state?.errors.OrganizationName.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
              

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <Input
                  name="username"
                  placeholder="Enter your email"
                  type={ 'email'}
                  required
                  className="h-12"
                />
              </div>
              <div id="org-name-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.username &&
                  state?.errors.username.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
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
                {state?.errors?.OrganizationName &&
                  state?.errors.OrganizationName.map((error: string) => (
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
                // disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Submitting Request...
                  </div>
                ) : ( */}
                Submit Request
                {/* )} */}
                
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => router.push('/auth/signin')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                  Already have an account?
              </button>
            </div>

            
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200 text-center">
                <strong>Note:</strong> Organization registration requires admin approval.
                <br />
                <br />
                <span className="font-semibold">For learner credentials, contact your organization directly.</span>
              </p>
            </div>
            

            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
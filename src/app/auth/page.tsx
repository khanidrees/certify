'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useState, ChangeEvent, FormEvent } from 'react'
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

type Role = 'organization'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<{ username: string; password: string; role: Role; organizationName: string }>({
    username: '',
    password: '',
    organizationName: '',
    role: 'organization',
  })
  const [msg, setMsg] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMsg('')

    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      if (data.message === 'User created') {
        toast.success('Sign up request sent successfully! Please wait for admin approval.');
        setForm({ username: '', password: '', organizationName: '', role: 'organization' })
        return
      }

      toast(data.message || '')

      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        
        if (data.role === 'organization') {
          window.location.href = '/dashboard'
        } else if (data.role === 'admin') {
          window.location.href = '/admin/dashboard'
        } else {
          window.location.href = '/learner-dashboard'
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
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
            {isLogin ? 'Welcome Back' : 'Create Organization Account'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin 
              ? 'Sign in to your VerifyCertify account' 
              : 'Request access for your organization'
            }
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur dark:bg-gray-800/80">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              {isLogin ? 'Sign In' : 'Organization Registration'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Enter your credentials to access your dashboard' 
                : 'Submit your organization details for approval'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Organization Name
                  </label>
                  <Input
                    type="text"
                    name="organizationName"
                    placeholder="Enter your organization name"
                    value={form.organizationName}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <Input
                  name="username"
                  placeholder="Enter your email"
                  type={isLogin ? 'text' : 'email'}
                  value={form.username}
                  onChange={handleChange}
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
                    value={form.password}
                    onChange={handleChange}
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    {isLogin ? 'Signing In...' : 'Submitting Request...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Submit Request'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setMsg('')
                  setForm({ username: '', password: '', organizationName: '', role: 'organization' })
                }}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {isLogin ? 'Need an organization account?' : 'Already have an account?'}
              </button>
            </div>

            {!isLogin && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                  <strong>Note:</strong> Organization registration requires admin approval.
                  <br />
                  <br />
                  <span className="font-semibold">For learner credentials, contact your organization directly.</span>
                </p>
              </div>
            )}

            {/* {msg && (
              <div className={`mt-4 p-4 rounded-lg text-center text-sm ${
                msg.includes('successfully') || msg.includes('sent')
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                  : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'
              }`}>
                {msg}
              </div>
            )} */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
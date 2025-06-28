'use client'
import { useCounterProgram } from '@/components/counter/counter-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner, LoadingPage } from '@/components/ui/loading-spinner'
import Link from 'next/link'
import { toast } from 'sonner'
import React, { useEffect } from 'react'
import { Award, Share2, ExternalLink, Calendar, Building2, User } from 'lucide-react'

const LearnersDashboard = () => {
  const [user, setUser] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const { useCertificatesByLearner } = useCounterProgram()
  const certificates = useCertificatesByLearner(user?._id?.toString() || '')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/auth'
    } else {
      fetch('/api/learner', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setUser(data)
          setIsLoading(false)
        })
        .catch(err => {
          console.error('Error fetching learner dashboard:', err)
          setIsLoading(false)
        })
    }
  }, [])

  const handleShareCertificate = (courseId: string, learnerId: string) => {
    const shareUrl = `${window.location.origin}/public/course/${courseId}/learner/${learnerId}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Certificate link copied to clipboard!')
  }

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome, {user?.learnerName || 'Learner'}!
                </h1>
                <p className="text-blue-100 text-lg">
                  Track your learning progress and manage your certificates
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">Organization</span>
                </div>
                <p className="text-blue-100">{user?.organizationName || 'Not specified'}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">Certificates Earned</span>
                </div>
                <p className="text-blue-100 text-2xl font-bold">
                  {certificates.data?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Certificates
            </h2>
            {certificates.isLoading && (
              <LoadingSpinner size="sm" />
            )}
          </div>

          {certificates.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border animate-pulse">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : certificates.data?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.data.map((cert, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      {cert.account.courseName}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Certificate of Completion
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      Issued on {new Date(cert.account.issueDate.toNumber() * 1000).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/public/course/${cert.account.courseId}/learner/${cert.account.learnerId}`}
                        className="flex-1"
                      >
                        <Button 
                          variant="outline" 
                          className="w-full h-10 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Verify
                        </Button>
                      </Link>
                      
                      <Button
                        onClick={() => handleShareCertificate(cert.account.courseId, cert.account.learnerId)}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No certificates yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Complete courses to earn certificates. Your achievements will appear here once issued by your organization.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LearnersDashboard
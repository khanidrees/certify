'use client'
import { useCounterProgram } from '@/components/counter/counter-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner, LoadingPage } from '@/components/ui/loading-spinner'
import { useWallet } from '@solana/wallet-adapter-react'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { Award, Users, Calendar, BookOpen, Wallet } from 'lucide-react'
import { Types } from 'mongoose'


const CoursePage = () => {
  const params = useParams()
  const courseId = params.courseId as string
  const [course, setCourse] = React.useState<{
    courseName: string
    description: string
    createdAt: Date
    learners: { 
      _id: Types.ObjectId;
      learnerName: string; 
      username: string }[]
  }>({
    courseName: '',
    description: '',
    createdAt: new Date(),
    learners: []
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [issuingCertificates, setIssuingCertificates] = React.useState<Set<string>>(new Set())
  const { publicKey } = useWallet()
  const { createCertificate } = useCounterProgram()

  useEffect(() => {
    if (!courseId) {
      console.error('Course ID is missing')
      return
    }
    
    fetch(`/api/organization/courses/${courseId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching course:', data.error)
          return
        }
        setCourse(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching course:', error)
        setIsLoading(false)
      })
  }, [courseId])

  const handleIssueCertificate = async (
    learnerName: string,
    courseId: string,
    learnerId: string,
    courseName: string
  ) => {
    if (!publicKey) {
      alert('Please connect your wallet to issue a certificate')
      return
    }
    
    setIssuingCertificates(prev => new Set(prev).add(learnerId))
    
    try {
      const txSignature = await createCertificate.mutateAsync({
        learnerId,
        courseName: courseName,
        name: learnerName,
        courseId, 
      })
      
      console.log('Certificate issued successfully:', txSignature)
      alert(`Certificate issued successfully! Transaction Signature: ${txSignature}`)
    } catch (error) {
      console.error('Error issuing certificate:', error)
      alert('Failed to issue certificate')
    } finally {
      setIssuingCertificates(prev => {
        const newSet = new Set(prev)
        newSet.delete(learnerId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (!courseId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">Course ID is missing</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        {/* Course Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{course.courseName}</h1>
                <p className="text-indigo-100 text-lg">{course.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Created</span>
                </div>
                <p className="text-indigo-100">{new Date(course.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Enrolled Learners</span>
                </div>
                <p className="text-indigo-100 text-2xl font-bold">{course.learners.length}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-5 w-5" />
                  <span className="font-medium">Wallet Status</span>
                </div>
                <p className="text-indigo-100">{publicKey ? 'Connected' : 'Not Connected'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Connection Notice */}
        {!publicKey && (
          <div className="mb-8">
            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Wallet className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Wallet Connection Required
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                      Please connect your wallet to issue certificates to learners.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Learners Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enrolled Learners
          </h2>

          {course.learners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.learners.map((learner: { learnerName: string; username: string; _id: Types.ObjectId }, index: number) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      {learner.learnerName}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {learner.username}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {publicKey ? (
                      <Button
                        onClick={() => handleIssueCertificate(
                          learner.learnerName, 
                          courseId, 
                          learner._id.toString(), 
                          course.courseName
                        )}
                        disabled={issuingCertificates.has(learner._id.toString())}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                      >
                        {issuingCertificates.has(learner._id.toString()) ? (
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            Issuing Certificate...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Issue Certificate
                          </div>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        disabled 
                        variant="outline" 
                        className="w-full h-12 text-gray-500"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet to Issue
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No learners enrolled
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Add learners to this course from the dashboard to start issuing certificates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoursePage
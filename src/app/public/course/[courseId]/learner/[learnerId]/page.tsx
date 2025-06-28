'use client'
import { useCounterProgram } from '@/components/counter/counter-data-access'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useParams } from 'next/navigation'
import React from 'react'
import { Award, Calendar, CheckCircle, XCircle, Shield, ExternalLink } from 'lucide-react'

const CertificateVerification = () => {
  const { courseId, learnerId }: { courseId: string, learnerId: string } = useParams()
  const { useCertificateByCourseIdLearnerId } = useCounterProgram()
  const certificate = useCertificateByCourseIdLearnerId(courseId || '', learnerId || '')
  const verifiedCertificate = certificate.data?.length && certificate.data[0]

  if (certificate.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
            <LoadingSpinner size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verifying Certificate...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we verify the certificate on the blockchain
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Certificate Verification
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Blockchain-powered certificate authenticity verification
            </p>
          </div>

          {verifiedCertificate ? (
            <div className="space-y-8">
              {/* Verification Status */}
              <Card className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                        Certificate Verified ✓
                      </h3>
                      <p className="text-green-700 dark:text-green-300">
                        This certificate is authentic and has been verified on the Solana blockchain.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certificate Details */}
              <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Award className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        Certificate of Completion
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        Blockchain-verified digital certificate
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {verifiedCertificate.account.name}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                      has successfully completed
                    </p>
                    <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                      {verifiedCertificate.account.courseName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">Issue Date</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(verifiedCertificate.account.issueDate.toNumber() * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">Blockchain Verified</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Solana Network
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">Course ID</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                        {verifiedCertificate.account.courseId}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">Learner ID</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                        {verifiedCertificate.account.learnerId}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-8">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      <p>This certificate is cryptographically secured and permanently stored on the Solana blockchain.</p>
                      <p className="mt-2">Certificate authenticity can be independently verified at any time.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
                  Certificate Not Found
                </h2>
                <p className="text-red-700 dark:text-red-300 mb-6">
                  No certificate was found for the provided course and learner IDs. 
                  This could mean the certificate has not been issued yet or the provided information is incorrect.
                </p>
                <div className="bg-red-100 dark:bg-red-900/40 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    Verification Details:
                  </h3>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Course ID: {courseId}</li>
                    <li>• Learner ID: {learnerId}</li>
                    <li>• Blockchain: Solana Network</li>
                    <li>• Status: Not Found</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default CertificateVerification
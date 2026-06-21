'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useWallet } from '@solana/wallet-adapter-react';
import { useCounterProgram } from '@/components/counter/counter-data-access'
import { useState } from 'react'
import { Types } from 'mongoose'
interface PopulatedUser {
  _id: Types.ObjectId;
  username: string;
  learnerName: string;
}

export interface PopulatedCourse {
  _id: Types.ObjectId;
  courseName: string;
  description: string;
  createdAt: Date;
  learners: PopulatedUser[];
  organizationId: Types.ObjectId;

}

const Course = ({ course }: { course: PopulatedCourse }) => {
    const [issuingCertificates, setIssuingCertificates] = useState<Set<string>>(new Set())
    const { publicKey } = useWallet()
    const { createCertificate } = useCounterProgram();


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


  return (
    <div className="min-h-screen bg-surface-dim text-on-surface font-body-md overflow-x-hidden relative pt-20">
      <div className="max-w-container-max mx-auto p-md md:p-lg space-y-lg">
        {/* Course Header */}
        <div className="mb-xl">
          <div className="glass-surface-2 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-3xl rounded-full"></div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 z-10 relative">
              <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center border border-primary/30">
                <span className="material-symbols-outlined text-primary text-3xl">book</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-on-surface">{course.courseName}</h1>
                <p className="text-on-surface-variant text-sm mt-1">{course.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span className="font-semibold uppercase tracking-wider font-label-caps">Created</span>
                </div>
                <p className="text-on-surface font-medium text-sm">
                  {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">groups</span>
                  <span className="font-semibold uppercase tracking-wider font-label-caps">Enrolled Learners</span>
                </div>
                <p className="text-on-surface text-xl font-bold">
                  {course.learners.length}
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">wallet</span>
                  <span className="font-semibold uppercase tracking-wider font-label-caps">Wallet Status</span>
                </div>
                <p className={`text-sm font-bold ${publicKey ? 'text-secondary' : 'text-amber-500'}`}>
                  {publicKey ? 'Connected' : 'Not Connected'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Connection Notice */}
        {!publicKey && (
          <div className="mb-8">
            <Card className="border border-amber-500/20 bg-amber-500/5 text-amber-200 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-500 text-3xl">warning</span>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider font-label-caps">
                      Wallet Connection Required
                    </h3>
                    <p className="text-xs text-amber-200/70 mt-1">
                      Please connect your Solana wallet to securely sign transactions and issue credentials onto the blockchain.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Learners Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined">person</span>
            Enrolled Learners
          </h2>

          {Array.isArray(course.learners) && course.learners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.learners.map((learner, index: number) => (
                <Card key={index} className="hover:scale-[1.02] transition-all duration-300 border border-white/10 shadow-lg bg-surface-container/70 backdrop-blur-md rounded-xl overflow-hidden flex flex-col group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold text-on-surface leading-tight">
                      {learner?.learnerName}
                    </CardTitle>
                    <CardDescription className="text-xs text-on-surface-variant">
                      {learner.username}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {publicKey ? (
                      <Button
                        onClick={() => handleIssueCertificate(
                          learner.learnerName, 
                          course._id.toString(), 
                          learner._id.toString(), 
                          course.courseName
                        )}
                        disabled={issuingCertificates.has(learner._id.toString())}
                        className="w-full h-11 bg-primary text-on-primary font-bold text-xs tracking-wider rounded-lg shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        {issuingCertificates.has(learner._id.toString()) ? (
                          <div className="flex items-center gap-2 justify-center">
                            <LoadingSpinner size="sm" />
                            <span>Issuing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 justify-center">
                            <span className="material-symbols-outlined text-sm">workspace_premium</span>
                            <span>Issue Certificate</span>
                          </div>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        disabled 
                        variant="outline" 
                        className="w-full h-11 border-white/10 text-on-surface-variant/40 rounded-lg text-xs"
                      >
                        <span className="material-symbols-outlined text-sm mr-2">wallet</span>
                        Connect Wallet to Issue
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-surface-1 rounded-xl">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <span className="material-symbols-outlined text-on-surface-variant text-3xl">groups</span>
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-2">
                No learners enrolled
              </h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                Add learners to this course from the dashboard to start issuing certificates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Course
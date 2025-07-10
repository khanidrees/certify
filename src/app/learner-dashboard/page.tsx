

import { LoadingSpinner, LoadingPage } from '@/components/ui/loading-spinner'
import Link from 'next/link'
import { toast } from 'sonner'
import { Suspense, } from 'react'
import { Award, Share2, ExternalLink, Calendar, Building2, User } from 'lucide-react'
import { fetchLearner } from '../lib/data'
import Certificates from '@/components/dashboard/Certificates'

const LearnersDashboard = async() => {
  const response = await fetchLearner();
  const { data, message, status } = response;
  console.log(data)
  return (
    <Suspense fallback={<LoadingPage />}>
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
                    Welcome, {data?.user?.learnerName || 'Learner'}!
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
                  <p className="text-blue-100">{data?.user?.organizationName || 'Not specified'}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5" />
                    <span className="font-medium">Certificates Earned</span>
                  </div>
                  <p className="text-blue-100 text-2xl font-bold">
                    {/* {certificates.data?.length || 0} */}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Certificates userId={data?.user?.id || ''} />
          
        </div>
      </div>
    </Suspense>
  )
}

export default LearnersDashboard
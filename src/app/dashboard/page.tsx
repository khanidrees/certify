
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {  LoadingPage } from '@/components/ui/loading-spinner'
import Link from 'next/link'
import {  
  Users, 
  BookOpen, 
  Calendar, 
  ExternalLink, 
  Award,
  TrendingUp,
  BarChart3,
  Clock,
  Building2,
  GraduationCap,
  Target,
  Activity
} from 'lucide-react'
import CreateCourseModal from '@/components/modals/CreateCourseModal'
import AddLearnerModal from '@/components/modals/AddLearnerModal'
import { fetchDashboardData } from '../lib/data'
import { Suspense } from 'react'
import { ICourse } from '@/models/Course'





interface DashboardStats {
  totalCourses: number
  totalLearners: number
  totalCertificatesIssued: number
  recentActivity: number
}

type Res = {
  message: string,
  status: number,
  data?: {
    courses?:ICourse[]
  }
}



export default async function Dashboard() {
  const response : Res = await fetchDashboardData();

  const totalLearners = response?.data?.courses?.reduce((acc: number, course: ICourse) => 
          acc + (course.learners?.length || 0), 0
        ) || 0;

  const stats: DashboardStats = {
    totalCourses: response?.data?.courses?.length || 0,
    totalLearners,
    totalCertificatesIssued: Math.floor(totalLearners * 0.8), // Assuming 80% completion rate
    recentActivity: response?.data?.courses?.filter((course: ICourse) => {
      const courseDate = new Date(course.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return courseDate > weekAgo
    }).length || 0
  }

  // useEffect(() => {
    

  //   fetch('/api/organization/dashboard', {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //     .then(res => res.json())
  //     .then(d => {
  //       const coursesData = d.courses || []
  //       setCourses(coursesData)
        
  //       // Calculate stats
  //       const totalLearners = coursesData.reduce((acc: number, course: Course) => 
  //         acc + (course.learners?.length || 0), 0
  //       )
        
  //       setStats({
  //         totalCourses: coursesData.length,
  //         totalLearners,
  //         totalCertificatesIssued: Math.floor(totalLearners * 0.8), // Assuming 80% completion rate
  //         recentActivity: coursesData.filter((course: Course) => {
  //           const courseDate = new Date(course.createdAt)
  //           const weekAgo = new Date()
  //           weekAgo.setDate(weekAgo.getDate() - 7)
  //           return courseDate > weekAgo
  //         }).length
  //       })
        
  //       setIsLoading(false)
  //     })
  //     .catch(() => setIsLoading(false))
  // }, [])

  

  

  // if (isLoading) {
  //   return <LoadingPage />
  // }

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
                    <p className="text-blue-100 text-lg">
                      Manage your courses, learners, and certificates with ease
                    </p>
                  </div>
                </div>
                
                <CreateCourseModal/>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 dark:text-green-400">Active courses</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Learners</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLearners}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Activity className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-blue-600 dark:text-blue-400">Enrolled students</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates Issued</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCertificatesIssued}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <GraduationCap className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-purple-600 dark:text-purple-400">Completed courses</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Activity</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.recentActivity}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Clock className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-orange-600 dark:text-orange-400">This week</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Courses Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Courses</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your courses and track learner progress
                </p>
              </div>
            </div>

            {Array.isArray(response?.data?.courses) && response?.data?.courses.length !== 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {response?.data?.courses.map((course: ICourse, index: number) =>{
                  
                  
                    return(<Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white dark:bg-gray-800 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">Active</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {course.courseName}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-3">
                          {course.description}
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(course.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.learners?.length || 0} learners
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex flex-col gap-3">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Course Progress</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {course.learners?.length ? Math.floor((course.learners.length * 0.8)) : 0}/{course.learners?.length || 0}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: course.learners?.length 
                                  ? `${Math.min((course.learners.length * 0.8 / course.learners.length) * 100, 100)}%` 
                                  : '0%' 
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <AddLearnerModal courseId={course._id.toString()} />
                          
                          <Link
                            href={`/organization/courses/${course._id.toString()}`}
                            className="flex-1"
                          >
                            <Button 
                              variant="outline" 
                              className="w-full h-10 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)
                
                }
              )}
              </div>
              
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No courses yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Get started by creating your first course. You can then add learners and issue certificates.
                </p>
                <CreateCourseModal/>
              </div>
            )}
          </div>

          {/* Quick Actions Section */}
          {Array.isArray(response?.data?.courses) && response?.data?.courses.length > 0 && (
            <div className="mt-12">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-2">Ready to Issue Certificates?</h3>
                      <p className="text-blue-100 text-lg">
                        Connect your wallet and start issuing blockchain-verified certificates to your learners.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/account">
                        <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3">
                          <Target className="h-4 w-4 mr-2" />
                          Connect Wallet
                        </Button>
                      </Link>
                      <Button variant="secondary" className="border-white text-blue-400 hover:bg-white/10 px-6 py-3">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Guide
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  )
}
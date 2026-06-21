
import { LoadingPage } from '@/components/ui/loading-spinner'
import Link from 'next/link'
import CreateCourseModal from '@/components/modals/CreateCourseModal'
import AddLearnerModal from '@/components/modals/AddLearnerModal'
import { fetchDashboardData } from '../lib/data'
import { Suspense } from 'react'
import { PopulatedCourse } from '@/components/ui/Course'





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
    courses?:PopulatedCourse[] 
  }
}



export default async function Dashboard() {
  const response : Res   = await fetchDashboardData() as Res;

  const totalLearners = response?.data?.courses?.reduce((acc: number, course: PopulatedCourse) => 
          acc + (course.learners?.length || 0), 0
        ) || 0;

  const stats: DashboardStats = {
    totalCourses: response?.data?.courses?.length || 0,
    totalLearners,
    totalCertificatesIssued: totalLearners, // In our flow, each learner enrolled represents an issued certificate record
    recentActivity: response?.data?.courses?.filter((course: PopulatedCourse) => {
      const courseDate = new Date(course.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return courseDate > weekAgo
    }).length || 0
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="min-h-screen bg-surface text-on-surface font-body-md overflow-x-hidden relative pt-20">
        <div className="max-w-container-max mx-auto p-md md:p-lg space-y-lg">
          {/* Dashboard Header & Actions */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-white/5 pb-lg">
            <div className="space-y-xs">
              <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-gradient">Organization Dashboard</h1>
              <p className="text-on-surface-variant max-w-2xl font-body-lg">
                Manage your academic infrastructure, track student progress across the Solana network, and issue high-fidelity verifiable credentials.
              </p>
            </div>
            <div className="flex flex-wrap gap-sm">
              <CreateCourseModal />
            </div>
          </section>

          {/* Metrics Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            <div className="glass-surface p-md rounded-xl space-y-md">
              <div className="flex justify-between items-start">
                <span className="p-sm bg-primary/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined">school</span>
                </span>
                <span className="text-secondary font-label-caps">Total</span>
              </div>
              <div>
                <p className="font-label-caps text-on-surface-variant text-xs">Total Courses</p>
                <h3 className="text-2xl font-bold font-headline-md">{stats.totalCourses}</h3>
              </div>
            </div>

            <div className="glass-surface p-md rounded-xl space-y-md">
              <div className="flex justify-between items-start">
                <span className="p-sm bg-tertiary/10 text-tertiary rounded-lg">
                  <span className="material-symbols-outlined">group</span>
                </span>
                <span className="text-secondary font-label-caps">Active</span>
              </div>
              <div>
                <p className="font-label-caps text-on-surface-variant text-xs">Active Students</p>
                <h3 className="text-2xl font-bold font-headline-md">{stats.totalLearners}</h3>
              </div>
            </div>

            <div className="glass-surface p-md rounded-xl space-y-md">
              <div className="flex justify-between items-start">
                <span className="p-sm bg-secondary/10 text-secondary rounded-lg">
                  <span className="material-symbols-outlined">verified</span>
                </span>
                <span className="text-on-surface-variant font-label-caps">On-chain</span>
              </div>
              <div>
                <p className="font-label-caps text-on-surface-variant text-xs">Certificates Issued</p>
                <h3 className="text-2xl font-bold font-headline-md">{stats.totalCertificatesIssued}</h3>
              </div>
            </div>

            <div className="glass-surface p-md rounded-xl space-y-md relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>
              <div className="flex justify-between items-start">
                <span className="p-sm bg-surface-container-high border border-outline-variant/30 text-primary rounded-lg">
                  <span className="material-symbols-outlined">explore</span>
                </span>
                <span className="text-on-surface-variant font-label-caps">This Week</span>
              </div>
              <div>
                <p className="font-label-caps text-on-surface-variant text-xs">Recent Activity</p>
                <h3 className="text-2xl font-bold font-headline-md">{stats.recentActivity}</h3>
              </div>
            </div>
          </section>

          {/* Courses Section */}
          <section className="space-y-md">
            <div className="flex items-center justify-between">
              <h2 className="font-title-sm text-lg font-bold text-on-surface">Your Programs &amp; Courses</h2>
            </div>

            {Array.isArray(response?.data?.courses) && response?.data?.courses.length !== 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                {response?.data?.courses.map((course: PopulatedCourse, index: number) => (
                  <div key={index} className="glass-surface p-md rounded-xl space-y-md flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                    <div className="space-y-sm">
                      <div className="flex justify-between items-start">
                        <span className="p-sm bg-primary/10 text-primary rounded-lg">
                          <span className="material-symbols-outlined">book</span>
                        </span>
                        <span className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 px-sm py-xs rounded uppercase font-semibold">Active</span>
                      </div>
                      <h3 className="font-title-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">{course.courseName}</h3>
                      <p className="text-on-surface-variant text-xs line-clamp-3 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="space-y-md pt-md border-t border-white/5">
                      <div className="flex justify-between items-center text-xs text-on-surface-variant">
                        <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                        <span>{course.learners?.length || 0} Learners</span>
                      </div>
                      <div className="flex gap-sm">
                        <AddLearnerModal courseId={course._id.toString()} />
                        <Link href={`/organization/courses/${course._id.toString()}`} className="flex-1">
                          <button className="w-full h-10 glass-surface hover:bg-white/10 text-on-surface text-xs font-bold rounded-lg border border-white/5 transition-all">
                            Manage
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-surface rounded-xl">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">book</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2">No courses yet</h3>
                <p className="text-xs text-on-surface-variant mb-6 max-w-md mx-auto">
                  Get started by creating your first course. You can then add learners and issue certificates.
                </p>
                <div className="flex justify-center">
                  <CreateCourseModal />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </Suspense>
  )
}
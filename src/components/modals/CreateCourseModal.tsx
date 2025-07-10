'use client'
import { AppModal } from '../app-modal';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useState } from 'react';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Plus } from 'lucide-react';

const CreateCourseModal = () => {
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  const createCourseSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingCourse(true)
    
    const token = localStorage.getItem('token')
    const formData = new FormData(e.target as HTMLFormElement)
    const courseName = formData.get('courseName') as string
    const description = formData.get('description') as string

    try {
      const res = await fetch('/api/organization/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseName, description }),
      })

      if (res.ok) {
        const newCourse = await res.json()
        // setCourses([...courses, newCourse])
        // setStats(prev => ({
        //   ...prev,
        //   totalCourses: prev.totalCourses + 1,
        //   recentActivity: prev.recentActivity + 1
        // }))
        ;(e.target as HTMLFormElement).reset()
      } else {
        alert('Failed to create course')
      }
    } catch (error) {
      alert('Failed to create course')
    } finally {
      setIsCreatingCourse(false)
    }
  }
  return (
    <AppModal title="Create New Course" triggerVariant='default'>
                <form onSubmit={createCourseSubmitHandler} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="courseName" className="text-sm font-medium">
                      Course Name
                    </Label>
                    <Input
                      id="courseName"
                      type="text"
                      name="courseName"
                      placeholder="Enter course name"
                      required
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Enter course description"
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    />
                  </div>
                  
                  <Button
                    type="submit" 
                    disabled={isCreatingCourse}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    {isCreatingCourse ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        Creating Course...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Course
                      </div>
                    )}
                  </Button>
                </form>
              </AppModal>
  )
}

export default CreateCourseModal;
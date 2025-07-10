'use client'
import { AppModal } from '../app-modal';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useActionState, useState } from 'react';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Plus } from 'lucide-react';
import { createCourse } from '@/app/lib/actions';

const CreateCourseModal = () => {
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  const initalState = {
    message : '',
    errors : {},
    status: 0
  };
  
  const [state, formAction, isPending] = useActionState(createCourse, initalState);
  
  return (
    <AppModal title="Create New Course" triggerVariant='default'>
                <form action={formAction} className="space-y-6">
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
                  {state?.errors?.courseName && (
                    <div className="text-red-500 text-sm">
                      {state.errors.courseName}
                    </div>
                  )}
                  
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
                  {state?.errors?.description && (
                    <div className="text-red-500 text-sm">
                      {state.errors.description}
                    </div>
                  )}
                  {state?.message && (
                    <div className={"text-sm "+ (state.status === 201 ? "text-green-500" : "text-red-500")}>
                      {state.message}
                    </div>
                  )}

                  
                  <Button
                    type="submit" 
                    disabled={isPending}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    {isPending ? (
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
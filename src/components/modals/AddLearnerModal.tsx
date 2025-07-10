'use client'

import { Types } from "mongoose";
import { AppModal } from '../app-modal';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useState } from 'react';
import { LoadingSpinner } from '../ui/loading-spinner';
import { ICourse } from "@/models/Course";
import { UserPlus } from "lucide-react";


const AddLearnerModal = ({ courseId }: { courseId: string }) => {
  const [isAddingLearner, setIsAddingLearner] = useState<string | null>(null);

  const addLearnerSubmitHandler = async (e: React.FormEvent, courseId: string) => {
      e.preventDefault()
      setIsAddingLearner(courseId.toString())
      
      const formData = new FormData(e.target as HTMLFormElement)
      const username = formData.get('username') as string
      const learnerName = formData.get('learnerName') as string
  
      const token = localStorage.getItem('token')
      try {
        const res = await fetch(`/api/organization/courses/${courseId.toString()}/learners`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, learnerName }),
        })
  
        if (res.ok) {
          // Refresh the courses data
          const dashboardRes = await fetch('/api/organization/dashboard', {
            headers: { Authorization: `Bearer ${token}` },
          })
          const dashboardData = await dashboardRes.json()
          // setCourses(dashboardData.courses || [])
          ;(e.target as HTMLFormElement).reset()
        } else {
          alert('Failed to add learner')
        }
      } catch (error) {
        alert('Failed to add learner')
      } finally {
        setIsAddingLearner(null)
      }
    }
  return (
    <AppModal title="Add Learner" triggerClassName="flex-1">
      <form 
        className="space-y-6" 
        onSubmit={(e) => addLearnerSubmitHandler(e, courseId)}
      >
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Learner Email
          </Label>
          <Input
            id="username"
            type="email"
            name="username"
            placeholder="Enter learner email"
            required
            className="h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="learnerName" className="text-sm font-medium">
            Learner Name
          </Label>
          <Input
            id="learnerName"
            type="text"
            name="learnerName"
            placeholder="Enter learner name"
            required
            className="h-12"
          />
        </div>

        <Button 
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
          type="submit"
          disabled={isAddingLearner === courseId.toString()}
        >
          {isAddingLearner === courseId.toString() ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Adding Learner...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Learner
            </div>
          )}
        </Button>
      </form>
    </AppModal>
  )
}

export default AddLearnerModal
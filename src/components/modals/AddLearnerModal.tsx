'use client'


import { AppModal } from '../app-modal';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useActionState, useState } from 'react';
import { LoadingSpinner } from '../ui/loading-spinner';
import { ICourse } from "@/models/Course";
import { UserPlus } from "lucide-react";
import { addLearner } from '@/app/lib/actions';
import { error } from 'console';


const AddLearnerModal = ({ courseId }: { courseId: string }) => {
  const initalState = {
    errors: {},
    message : '',
    status: 0
  }

  const [state, formAction, isPending] = useActionState(addLearner, initalState);
  
  return (
    <AppModal title="Add Learner" triggerClassName="flex-1">
      <form 
        className="space-y-6" 
        action={formAction}
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

        {state?.errors?.username && (
          <div className="text-red-500 text-sm">
            {state.errors.username}
          </div>
        )}
        
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
          {state?.errors?.learnerName && (
            <div className="text-red-500 text-sm">
              {state.errors.learnerName}
            </div>
          )}

          {state?.message && (
            <div className={"text-sm " + (state.status === 201 ? "text-green-500" : "text-red-500")}>
              {state.message}
            </div>
          )}
          <input type="hidden" name="courseId" value={courseId} />

        <Button 
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
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
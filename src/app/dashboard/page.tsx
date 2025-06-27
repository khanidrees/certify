'use client';
import { AppModal } from '@/components/app-modal';
import { Button } from '@/components/ui/button';
import mongoose, { Types } from 'mongoose';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Course extends mongoose.Document<Types.ObjectId> {
  courseName: string;
  description: string;
  createdAt: Date;
  learners?: {
    learnerName: string;
    username: string;
  }[];
}

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/organization/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(d => setCourses(d.courses));
  }, []);

  const addLearnerSubmitHandler = async (e: React.FormEvent, courseId: Types.ObjectId) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const learnerName = formData.get('learnerName') as string;

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/organization/courses/${courseId.toString()}/learners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, learnerName }),
    });

    if (res.ok) {
      const updatedCourse = await res.json();
      setCourses(courses.map(course => 
        course._id === updatedCourse._id ? updatedCourse : course
      ));
    } else {
      alert('Failed to add learner');
    }
  };
  const createCourseSubmitHandler = async (e: React.FormEvent) => {
    console.log('createCourseSubmitHandler called',e.target);
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target as HTMLFormElement);
    const courseName = formData.get('courseName') as string;
    const description = formData.get('description') as string;

    const res = await fetch('/api/organization/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseName, description }),
    });

    if (res.ok) {
      const newCourse = await res.json();
      setCourses([...courses, newCourse]);
    } else {
      alert('Failed to create course');
    }
  };

  return <div>
    <div className='p-4 flex  items-center justify-between '>
      <h1 className='text-2xl font-bold mb-4'>Organization Dashboard</h1>
      <AppModal title='Create Course' >
        <form
        onSubmit={createCourseSubmitHandler}
        className='flex flex-col gap-4'>
          <label>
            Course Name:
            <input
            type='text'
            name='courseName'
            placeholder='Enter course name'
            required
             className='border p-2 rounded w-full' />
          </label>
          <label>
            Description:
            <textarea
            name='description'
            placeholder='Enter course description'
            required  
            className='border p-2 rounded w-full' rows={4}></textarea>
          </label>
          <Button type='submit'  className='bg-blue-500 text-white'>Create Course</Button>
        </form>
      </AppModal>
    </div>
    
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {courses.length !=0 ? courses.map((course: Course, index: number) => (
        <div key={ index} className='border p-4 rounded-lg shadow'>
          <div>
            <div>
            <h2 className='text-xl font-semibold'>{course.courseName}</h2>
            <p>{course.description}</p>
            <p className='text-sm text-gray-500'>Created on: {new Date(course.createdAt).toLocaleDateString()}</p>
            <AppModal title='Add learners' >
              <form className='flex flex-col gap-4' onSubmit={(e)=> addLearnerSubmitHandler(e, course._id)} >
                <label>
                  Learner Username(email):
                  <input
                    type='email'
                    name='username'
                    placeholder='Enter learner email'
                    required
                    className='border p-2 rounded w-full'
                  />
                </label>
                <label>
                  Learner Name:
                  <input
                    type='text'
                    name='learnerName'
                    placeholder='Enter learner name'
                    required
                    className='border p-2 rounded w-full'
                  />
                </label>

              <Button className='bg-blue-500 text-white mt-2' type='submit'>Add Learners</Button>
              </form>
            </AppModal>
            </div>
            <div className=''>
                <Link
                  href={`/organization/courses/${course._id}`}
                  className='text-blue-500 hover:underline flex items-center gap-2 mt-2'>
                  View Course Details
                </Link>
            </div>
            {/* <div>
              //list of learners
              <h3 className='text-lg font-semibold mt-4'>Learners:</h3>
              {course.learners && course.learners.length > 0 ? (
                <ul className='list-disc pl-5'>
                  {course.learners.map((learner , idx) => (
                    <li key={idx} className='text-sm text-gray-700'>{learner.learnerName} ({learner.username})</li>
                  ))}
                </ul>
              ) : (
                <p className='text-gray-500'>No learners added yet.</p>
              )}
            </div> */}
          </div>
        </div>
      )):
      <div className='col-span-3 text-center p-4  rounded-lg shadow'>
        <p className='text-gray-500'>No courses available. Please create a course.</p>
      </div>
      }
    </div>
    
  </div>;
}
'use client';
import { useCounterProgram } from '@/components/counter/counter-data-access';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner'
import React, {  useEffect } from 'react'

const LearnersDashboard = () => {
  const [ user, setUser ] = React.useState<any>(null);
  const { useCertificatesByLearner } = useCounterProgram();
  const certificates = useCertificatesByLearner(user?._id?.toString()|| '' );
  console.log('Certificates:', certificates);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth'; // Redirect to auth page if not logged in
    } else {
      fetch('/api/learner', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          console.log('Learner Dashboard Data:', data);
          setUser(data);
        })
        .catch(err => {
          console.error('Error fetching learner dashboard:', err);
        });
    }
  }, []);
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Learner Dashboard</h1>
      {user && (
        <div className='mb-8'>
          <h2 className='text-xl font-semibold'>Welcome, {user.learnerName}</h2>
          <p>Username: {user.username}</p>
          <p>Organization: {user.organizationName}</p>
        </div>
      )}
      <h2 className='text-xl font-semibold mb-4'>Your Certificates</h2>
      {certificates.data?.length ? (
        <ul className='list-disc pl-5'>
          {certificates.data.map((cert, idx) => (
            <li key={idx} className='mb-2'>
              Course: {cert.account.courseName} - Issued on: {new Date(cert.account.issueDate.toNumber()).toLocaleDateString()}
              <Link
              href={`/public/course/${cert.account.courseId}/learner/${cert.account.learnerId}`}
              className="text-blue-500 hover:underline"
              >Verify</Link>
              <Button
                className="ml-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + `/public/course/${cert.account.courseId}/learner/${cert.account.learnerId}`);
                  //show toast
                  toast.success('Link copied to clipboard');
                }}
              >
                Share Certificate
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No certificates issued yet.</p>
      )}
    </div>
  );
}

export default LearnersDashboard
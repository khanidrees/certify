"use client";
import { useCounterProgram } from '@/components/counter/counter-data-access';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react';


const CoursePage = () => {
  const params = useParams()
  const courseId = params.courseId as string;
  const [course, setCourse] = React.useState<any>({
    courseName: '',
    description: '',
    createdAt: new Date(),
    learners: []
  });
  const { publicKey } = useWallet();
  const { createCertificate } = useCounterProgram();

  useEffect(() => {
    if (!courseId) {
      console.error('Course ID is missing');
      return;
    }
    
    fetch(`/api/organization/courses/${courseId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching course:', data.error);
          return;
        }
        setCourse(data)
      })
      .catch(error => console.error('Error fetching course:', error));
  },[]);

  const handleIssueCertificate = async (
    learnerName: string,
    courseId: string,
    learnerId: string,
    courseName: string
  ) => {
    if (!publicKey) {
      alert('Please connect your wallet to issue a certificate');
      return;
    }
    
    try {
      const txSignature = await createCertificate.mutateAsync({
        learnerId,
        courseName: courseName,
        name: learnerName,
        courseId, 
      });
      
      console.log('Certificate issued successfully:', txSignature);
      alert(`Certificate issued successfully! Transaction Signature: ${txSignature}`);
    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert('Failed to issue certificate');
    }
  };

  if (!courseId) {
    return <div>Error: Course ID is missing</div>
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Course Details</h1>
      <h3>Course Name: {course.courseName}</h3>
      <p>Description: {course.description}</p>
      <p>Created At: {new Date(course.createdAt).toLocaleDateString()}</p>
      <h2 className="text-xl font-semibold mt-4">Learners</h2>
      {course.learners.length > 0 ? (
        <ol className="list-disc pl-5">
          {course.learners.map((learner: any, index: number) => (
            <li key={index}>
              {learner.learnerName} ({learner.username})
              {publicKey ? (
                <Button
                  className="ml-2 bg-blue-500 text-white"
                  onClick={() => handleIssueCertificate(learner.learnerName, courseId, learner._id.toString(), course.courseName)}
                >
                  Issue Certificate
                </Button>
              ) : (
                <span className="ml-2 text-gray-500">Please connect your wallet to Issue Certificate</span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p>No learners enrolled in this course.</p>
      )}
    </div>
  )
}

export default CoursePage
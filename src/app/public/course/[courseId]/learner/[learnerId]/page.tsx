'use client'
import { useCounterProgram } from '@/components/counter/counter-data-access';
import { useParams } from 'next/navigation'
import React from 'react'

const CertificateVerification = () => {
  const { courseId , learnerId } : { courseId :string, learnerId: string } = useParams();
  const { useCertificateByCourseIdLearnerId } = useCounterProgram();
  const certificate = useCertificateByCourseIdLearnerId(courseId || '', learnerId ||'');
  const VerifiedCertificate  = certificate.data?.length && certificate.data[0];

  //show verifying untill VerifiedCertificate is not null
  if (!VerifiedCertificate) {
    return (
      <div>
        <h1>Verifying Certificate...</h1>
      </div>
    )
  }

  return (
    <div>
      <h1>Certificate Verification Page</h1>
      <div>
        {
          VerifiedCertificate ? (
          <div>
            <h2>Certificate Details</h2>
            <p>Name: {VerifiedCertificate.account.name}</p>
            <p>Course Name: {VerifiedCertificate.account.courseName}</p>
            <p>Issued Date: {new Date(VerifiedCertificate.account.issueDate.toNumber()).toLocaleDateString()} </p>
          </div>
        ) :
        (
          <div>
            <h2>No Certificate Found</h2>
          </div>
        )
        }
      </div>
    </div>
  )
}

export default CertificateVerification
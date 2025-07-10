'use client'

import mongoose from "mongoose"
import { Button } from "../ui/button"
import { updateOrgStatus } from "@/app/lib/actions"
import { useState } from "react"

type User = {
  _id: mongoose.Types.ObjectId
  username: string
  organizationName?: string| undefined
  isApproved: boolean
}
const ApproveBtn = ({user}: {user: User}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
    onClick={async() => {
      setLoading(true)
      await updateOrgStatus(user._id.toString())
      setLoading(false)
    }
    }
    disabled={loading}
    
    className={"text-white px-3 py-1 rounded"+(user.isApproved ? ' bg-red-500': ' bg-green-500')}>
      {user.isApproved ? 'Reject': 'Approve'}
    </Button>
  )
}

export default ApproveBtn
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken';
import '@/models/User';
import Course from '@/models/Course';
import { dbConnect } from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function fetchDashboardData() {
  const allCookies = await cookies();
  const token = allCookies.get('token')?.value;
  console.log("token: ", token);
  if (!token) return Response.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    console.log('payload', payload)
    if (payload.role !== 'organization') return Response.json({ message: 'Forbidden' }, { status: 403 });
    await dbConnect();
    const courses = await Course.find({ organizationId: payload.userId })
    .populate('learners', 'username learnerName')  
    .lean();
    console.log(courses);
    return { 
      message : 'Organization dashboard data',
      status: 200,
      data: {
        courses,
      }
       };
  } catch (e){
    console.log(e);
    return { message: 'Server Error', status: 500 , data : null};
  }
}
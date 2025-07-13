import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken';
import '@/models/User';
import Course from '@/models/Course';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function fetchDashboardData() {
  const allCookies = await cookies();
  const token = allCookies.get('token')?.value;
  console.log("token: ", token);
  if (!token) return { message: 'Unauthorized' , status: 401 };
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    console.log('payload', payload)
    if (payload.role !== 'organization') return { message: 'Forbidden' , status: 403 };
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
    return { message: 'Server Error', status: 500 };
  }
}

export async function fetchAdminDashBoard(){
  const allCookies = await cookies();
  const token = allCookies.get('token')?.value;
  if (!token) return { message: 'Unauthorized', tatus: 401 };
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (payload.role !== 'admin') return { message: 'Forbidden', status: 403 };
    await dbConnect();
    const users = await User.find({ role: 'organization' }).lean();
    return { 
      message : 'Admin dashboard data',
      status: 200,
      data: {
        users,
      }
    };
  } catch (e){
    console.log(e);
    return { message: 'Server Error', status: 500 };
  }
}

export async function fetchLearner(){
  const allCookies = await cookies();
  const token = allCookies.get('token')?.value;
  if (!token) return { message: 'Unauthorized', tatus: 401 };
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (payload.role !== 'learner') return { message: 'Forbidden', status: 403 };
    await dbConnect();
    const user = await User.findOne({ _id: payload.userId })
    .select('learnerName username')
    .lean();
    return { 
      message : 'Learner dashboard data',
      status: 200,
      data: {
        user,
      }
    };
  } catch (e){
    console.log(e);
    return { message: 'Server Error', status: 500 };
  }
}

export async function getCourseData(id: string) {
  await dbConnect();
  const course = await Course.findOne({ _id: id })
  .populate('learners', 'username learnerName')
  .lean();
  return course;
}
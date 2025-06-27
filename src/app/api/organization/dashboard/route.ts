import Course from '@/models/Course';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return Response.json({ message: 'Unauthorized' }, { status: 401 });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (payload.role !== 'organization') return Response.json({ message: 'Forbidden' }, { status: 403 });
    const courses = await Course.find({ organizationId: payload.userId })
    .populate('learners', 'username learnerName')  
    .lean();
    return Response.json({ message: 'Organization dashboard data', courses }, { status: 200 });
  } catch {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
}
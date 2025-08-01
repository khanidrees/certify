// POst a learner
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Course  from '@/models/Course';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@/models/User';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
const JWT_SECRET = process.env.JWT_SECRET as string;
export async function POST(req: NextRequest ) {
  const courseId =  req.nextUrl.searchParams.get('courseId') as string;
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (payload.role !== 'organization') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    
    await dbConnect();
    const course = await Course.findOne({ _id: courseId, organizationId: payload.userId })
    .populate('learners', 'username learnerName role');
    if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    
    const { username, learnerName }: { username: string; learnerName: string } = await req.json();
    if (!username || !learnerName) {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }
    //validate username as email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }
    
    const existingUser:IUser | null = await User.findOne({ username });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Password123', 10); // Default password, change as needed
      const newUser = await User.create({
      username,
      learnerName,
      role: 'learner',
      courseId: course._id,
      organizationId: payload.userId,
      password: hashedPassword
      });
      if(!newUser) {
        return NextResponse.json({ message: 'Failed to create learner' }, { status: 500 });
      }
      //update course with new learner
      const res = await Course.findOneAndUpdate(
      { _id: course._id },
      { $addToSet: { learners: newUser._id } },
      
      );
      return NextResponse.json({ message: 'Learner added successfully', user: newUser, course: res}, { status: 201 });
    
    }else{
      const res = await Course.findOneAndUpdate(
        { _id: course._id },
        { $addToSet: { learners: existingUser._id } },
        )
        console.log(res);
        return NextResponse.json({ message: 'Learner added successfully', user: existingUser, course }, { status: 201 });
    }

    

     
    
    
  } catch (error) {
    console.error('Error adding learner:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
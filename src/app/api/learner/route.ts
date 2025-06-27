// get the user's token from localStorage and fetch the learner data
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: Request) {
  try {
   
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.userId).select('-password -__v');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching learner data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
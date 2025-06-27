import { dbConnect } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  const { username, password }: { username: string; password: string } = await req.json();
  await dbConnect();
  const user: IUser | null = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return Response.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  if (user.role === 'organization' && !user.isApproved) {
    return Response.json({ message: 'Your organization account is not approved yet' }, { status: 403 });
  }
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  console.log(user.role, 'user role');
  return Response.json({ token, role: user.role }, { status: 200 });
}
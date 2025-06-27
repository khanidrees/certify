import { dbConnect } from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';
import bcrypt from 'bcrypt';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  console.log( await bcrypt.hash('admin@123', 10))
  const { username, password, role, organizationName }: { username: string; password: string; role: UserRole, organizationName:string } = await req.json();
  if (!['organization'].includes(role)) {
    return Response.json({ message: 'Invalid role' }, { status: 400 });
  }
  if (!username || !password || !organizationName) {
    return Response.json({ message: 'Username, password, and organization name are required' }, { status: 400 });
  }
  //username must be email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return Response.json({ message: 'Username should be an email ' }, { status: 400 });
  }
  await dbConnect();
  const exists = await User.findOne({ username });
  if (exists) return Response.json({ message: 'User exists' }, { status: 409 });
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed, role, organizationName });
  return Response.json({ message: 'User created' }, { status: 201 });
}
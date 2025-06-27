// get api/admin/dashboard to get all organization users and their approval status
import { dbConnect } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { NextRequest } from 'next/server'; 
import jwt from 'jsonwebtoken';   

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return Response.json({ message: 'Unauthorized' }, { status: 401 });
  
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (payload.role !== 'admin') return Response.json({ message: 'Forbidden' }, { status: 403 });

    await dbConnect();
    const users: IUser[] = await User.find({ role: 'organization' }).select('username organizationName isApproved');
    
    return Response.json(users);
  } catch (error) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
}

// PATCH api/admin/dashboard to approve or reject organization users
export async function PATCH(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return Response.json({ message: 'Unauthorized' }, { status: 401 });
  
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (payload.role !== 'admin') return Response.json({ message: 'Forbidden' }, { status: 403 });

    const { userId, isApproved }: { userId: string; isApproved: boolean } = await req.json();
    if (!userId || typeof isApproved !== 'boolean') {
      return Response.json({ message: 'Invalid request data' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findByIdAndUpdate(userId, { isApproved }, { new: true });
    
    if (!user) return Response.json({ message: 'User not found' }, { status: 404 });
    
    return Response.json({ message: 'User updated', user });
  } catch (error) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
}
import { dbConnect } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { badRequest, unauthorized, forbidden, ok, internalError } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

const JWT_SECRET = process.env.JWT_SECRET as string;

const loginSchema = z.object({
  username: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  const start = logger.startRequest('/api/auth/login', 'POST');
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      logger.endRequest(start, '/api/auth/login', 'POST', 400);
      return badRequest({ message: parsed.error.errors[0].message });
    }

    const { username, password } = parsed.data;

    await dbConnect();
    const user: IUser | null = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password || ''))) {
      logger.warn('Failed login attempt', { username });
      logger.endRequest(start, '/api/auth/login', 'POST', 401);
      return unauthorized({ message: 'Invalid email or password' });
    }

    if (user.role === 'organization' && !user.isApproved) {
      logger.endRequest(start, '/api/auth/login', 'POST', 403);
      return forbidden({ message: 'Your organization account is pending admin approval' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    logger.info('Successful login', { userId: String(user._id), role: user.role });
    logger.endRequest(start, '/api/auth/login', 'POST', 200);
    return ok({ message: 'Login successful', data: { token, role: user.role } });
  } catch (error) {
    logger.error('Login error', { error: (error as Error).message });
    logger.endRequest(start, '/api/auth/login', 'POST', 500);
    return internalError();
  }
}
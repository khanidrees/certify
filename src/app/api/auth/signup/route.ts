import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { badRequest, conflict, created, internalError } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

const signupSchema = z.object({
  username: z
    .string()
    .email('Username must be a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.literal('organization'),
  organizationName: z
    .string()
    .min(3, 'Organization name must be at least 3 characters'),
});

export async function POST(req: NextRequest) {
  const start = logger.startRequest('/api/auth/signup', 'POST');
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      logger.endRequest(start, '/api/auth/signup', 'POST', 400);
      return badRequest({ message: parsed.error.errors[0].message });
    }

    const { username, password, organizationName } = parsed.data;

    await dbConnect();
    const exists = await User.findOne({ username });
    if (exists) {
      logger.endRequest(start, '/api/auth/signup', 'POST', 409);
      return conflict({ message: 'An account with this email already exists' });
    }

    // Production: bcrypt rounds 12
    const hashed = await bcrypt.hash(password, 12);
    await User.create({ username, password: hashed, role: 'organization', organizationName });

    logger.info('Organization signup', { username, organizationName });
    logger.endRequest(start, '/api/auth/signup', 'POST', 201);
    return created({ message: 'Account created. Await admin approval before signing in.' });
  } catch (error) {
    logger.error('Signup error', { error: (error as Error).message });
    logger.endRequest(start, '/api/auth/signup', 'POST', 500);
    return internalError();
  }
}
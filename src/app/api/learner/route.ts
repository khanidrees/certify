import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { AuthError, verifyToken } from '@/lib/auth';
import { unauthorized, internalError } from '@/lib/apiResponse';
import User from '@/models/User';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  const start = logger.startRequest('/api/learner', 'GET');
  try {
    const payload = verifyToken(request);

    await dbConnect();
    const user = await User.findById(payload.userId).select('-password -__v');

    if (!user) {
      logger.endRequest(start, '/api/learner', 'GET', 404);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    logger.endRequest(start, '/api/learner', 'GET', 200);
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof AuthError) {
      logger.endRequest(start, '/api/learner', 'GET', error.status);
      return unauthorized({ message: error.message });
    }
    logger.error('Learner fetch error', { error: (error as Error).message });
    logger.endRequest(start, '/api/learner', 'GET', 500);
    return internalError();
  }
}
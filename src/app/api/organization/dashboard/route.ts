import { dbConnect } from '@/lib/mongodb';
import Course from '@/models/Course';
import { AuthError, verifyRole } from '@/lib/auth';
import { ok, unauthorized, internalError } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const start = logger.startRequest('/api/organization/dashboard', 'GET');
  try {
    const payload = verifyRole(req, 'organization');
    await dbConnect();
    const courses = await Course.find({ organizationId: payload.userId })
      .populate('learners', 'username learnerName')
      .lean();

    logger.endRequest(start, '/api/organization/dashboard', 'GET', 200);
    return ok({ message: 'Dashboard data fetched', data: { courses } });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.endRequest(start, '/api/organization/dashboard', 'GET', error.status);
      return unauthorized({ message: error.message });
    }
    logger.error('Org dashboard error', { error: (error as Error).message });
    logger.endRequest(start, '/api/organization/dashboard', 'GET', 500);
    return internalError();
  }
}
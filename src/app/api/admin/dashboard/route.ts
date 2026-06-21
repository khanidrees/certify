import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { AuthError, verifyRole } from '@/lib/auth';
import {
  ok,
  badRequest,
  unauthorized,
  notFound,
  internalError,
} from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

const patchSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  isApproved: z.boolean({ required_error: 'isApproved must be a boolean' }),
});

// GET /api/admin/dashboard — list all organization users
export async function GET(req: NextRequest) {
  const start = logger.startRequest('/api/admin/dashboard', 'GET');
  try {
    verifyRole(req, 'admin');
    await dbConnect();
    const users = await User.find({ role: 'organization' })
      .select('username organizationName isApproved createdAt')
      .lean();

    logger.endRequest(start, '/api/admin/dashboard', 'GET', 200);
    return ok({ message: 'Organization users fetched', data: users });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.endRequest(start, '/api/admin/dashboard', 'GET', error.status);
      return unauthorized({ message: error.message });
    }
    logger.error('Admin dashboard GET error', { error: (error as Error).message });
    logger.endRequest(start, '/api/admin/dashboard', 'GET', 500);
    return internalError();
  }
}

// PATCH /api/admin/dashboard — approve or reject an organization
export async function PATCH(req: NextRequest) {
  const start = logger.startRequest('/api/admin/dashboard', 'PATCH');
  try {
    const payload = verifyRole(req, 'admin');

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      logger.endRequest(start, '/api/admin/dashboard', 'PATCH', 400);
      return badRequest({ message: parsed.error.errors[0].message });
    }

    const { userId, isApproved } = parsed.data;
    await dbConnect();
    const user = await User.findByIdAndUpdate(userId, { isApproved }, { new: true });
    if (!user) {
      logger.endRequest(start, '/api/admin/dashboard', 'PATCH', 404);
      return notFound({ message: 'User not found' });
    }

    logger.info('Organization approval updated', {
      adminId: payload.userId,
      targetUserId: userId,
      isApproved,
    });
    logger.endRequest(start, '/api/admin/dashboard', 'PATCH', 200);
    return ok({ message: `Organization ${isApproved ? 'approved' : 'rejected'}`, data: user });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.endRequest(start, '/api/admin/dashboard', 'PATCH', error.status);
      return unauthorized({ message: error.message });
    }
    logger.error('Admin dashboard PATCH error', { error: (error as Error).message });
    logger.endRequest(start, '/api/admin/dashboard', 'PATCH', 500);
    return internalError();
  }
}
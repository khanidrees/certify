import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Course from '@/models/Course';
import User, { IUser } from '@/models/User';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { AuthError, verifyRole } from '@/lib/auth';
import {
  created,
  badRequest,
  unauthorized,
  notFound,
  internalError,
} from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

const addLearnerSchema = z.object({
  username: z.string().email('Learner username must be a valid email address'),
  learnerName: z.string().min(2, 'Learner name must be at least 2 characters'),
});

export async function POST(req: NextRequest) {
  const start = logger.startRequest('/api/organization/courses/[courseId]/learners', 'POST');
  try {
    const payload = verifyRole(req, 'organization');

    const courseId = req.nextUrl.searchParams.get('courseId');
    if (!courseId) {
      logger.endRequest(start, '/api/organization/courses/[courseId]/learners', 'POST', 400);
      return badRequest({ message: 'courseId query parameter is required' });
    }

    const body = await req.json();
    const parsed = addLearnerSchema.safeParse(body);
    if (!parsed.success) {
      logger.endRequest(start, '/api/organization/courses/[courseId]/learners', 'POST', 400);
      return badRequest({ message: parsed.error.errors[0].message });
    }

    const { username, learnerName } = parsed.data;

    await dbConnect();
    const course = await Course.findOne({
      _id: courseId,
      organizationId: payload.userId,
    }).populate('learners', 'username learnerName role');

    if (!course) {
      logger.endRequest(start, '/api/organization/courses/[courseId]/learners', 'POST', 404);
      return notFound({ message: 'Course not found or does not belong to your organization' });
    }

    const existingUser: IUser | null = await User.findOne({ username });

    if (!existingUser) {
      // Generate a predictable temporary password (Option B: Name + @ + email prefix)
      const tempPassword = `${learnerName.replace(/\s+/g, '')}@${username.split('@')[0]}`;
      const hashedPassword = await bcrypt.hash(tempPassword, 12);

      const newUser = await User.create({
        username,
        learnerName,
        role: 'learner',
        password: hashedPassword,
      });

      await Course.findByIdAndUpdate(course._id, {
        $addToSet: { learners: newUser._id },
      });

      logger.info('New learner created and enrolled', {
        learnerId: String(newUser._id),
        courseId,
        orgId: payload.userId,
      });
      logger.endRequest(start, '/api/organization/courses/[courseId]/learners', 'POST', 201);
      return created({
        message: 'Learner created and enrolled successfully',
        data: { user: { _id: newUser._id, username, learnerName }, courseId, tempPassword },
      });
    } else {
      // Learner already exists — just enroll them
      await Course.findByIdAndUpdate(course._id, {
        $addToSet: { learners: existingUser._id },
      });

      logger.info('Existing learner enrolled', {
        learnerId: String(existingUser._id),
        courseId,
        orgId: payload.userId,
      });
      logger.endRequest(start, '/api/organization/courses/[courseId]/learners', 'POST', 201);
      return created({
        message: 'Learner enrolled successfully',
        data: {
          user: {
            _id: existingUser._id,
            username: existingUser.username,
            learnerName: existingUser.learnerName,
          },
          courseId,
        },
      });
    }
  } catch (error) {
    if (error instanceof AuthError) {
      logger.endRequest(start, '/api/organization/courses/[courseId]/learners', 'POST', error.status);
      return unauthorized({ message: error.message });
    }
    logger.error('Add learner error', { error: (error as Error).message });
    logger.endRequest(start, '/api/organization/courses/[courseId]/learners', 'POST', 500);
    return internalError();
  }
}

// Satisfy Next.js requirement to export a NextResponse type
export type { NextResponse };
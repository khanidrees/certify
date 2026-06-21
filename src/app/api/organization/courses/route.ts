import { dbConnect } from '@/lib/mongodb';
import Course from '@/models/Course';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { AuthError, verifyRole } from '@/lib/auth';
import { created, badRequest, unauthorized, internalError } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

const courseSchema = z.object({
  courseName: z.string().min(3, 'Course name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export async function POST(req: NextRequest) {
  const start = logger.startRequest('/api/organization/courses', 'POST');
  try {
    const payload = verifyRole(req, 'organization');

    const body = await req.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      logger.endRequest(start, '/api/organization/courses', 'POST', 400);
      return badRequest({ message: parsed.error.errors[0].message });
    }

    const { courseName, description } = parsed.data;
    await dbConnect();
    const newCourse = await Course.create({
      courseName,
      description,
      organizationId: payload.userId,
    });

    logger.info('Course created', { courseId: String(newCourse._id), orgId: payload.userId });
    logger.endRequest(start, '/api/organization/courses', 'POST', 201);
    return created({ message: 'Course created successfully', data: newCourse });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.endRequest(start, '/api/organization/courses', 'POST', error.status);
      return unauthorized({ message: error.message });
    }
    logger.error('Course creation error', { error: (error as Error).message });
    logger.endRequest(start, '/api/organization/courses', 'POST', 500);
    return internalError();
  }
}

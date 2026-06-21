import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import '@/models/User';
import Course from '@/models/Course';
import { notFound, internalError } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const start = logger.startRequest('/api/organization/courses/[courseId]', 'GET');
  const { courseId } = await params;

  if (!mongoose.isValidObjectId(courseId)) {
    logger.endRequest(start, '/api/organization/courses/[courseId]', 'GET', 400);
    return NextResponse.json({ error: 'Invalid course ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const course = await Course.findOne({ _id: courseId }).populate(
      'learners',
      'learnerName username'
    );

    if (!course) {
      logger.endRequest(start, '/api/organization/courses/[courseId]', 'GET', 404);
      return notFound({ message: 'Course not found' });
    }

    logger.endRequest(start, '/api/organization/courses/[courseId]', 'GET', 200);
    return NextResponse.json(course);
  } catch (error) {
    logger.error('Course fetch error', { courseId, error: (error as Error).message });
    logger.endRequest(start, '/api/organization/courses/[courseId]', 'GET', 500);
    return internalError();
  }
}

// GET course by ID
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Course from '@/models/Course';

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;

  if (!ObjectId.isValid(courseId)) {
    return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
  }

  try {
    await dbConnect();
    const course = await Course.findOne({ _id: new ObjectId(courseId) })
    .populate('learners', 'learnerName username')
    ;

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import Course from "@/models/Course";
import jwt from "jsonwebtoken";

export async function POST(req: Request, res: Response) {
  //create a course
  const { courseName, description } = await req.json();
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    if (payload.role !== 'organization') {
      return Response.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const newCourse = await Course.create({
      courseName,
      description,
      organizationId: payload.userId,
    });
    
    return Response.json(newCourse, { status: 201 });
  }catch (error) {
    console.error('Error creating course:', error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


'use server'

import { dbConnect } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Course from '@/models/Course';
import { revalidatePath } from 'next/cache';

const JWT_SECRET = process.env.JWT_SECRET as string;

const FormScema = z.object({
  username: z.string().email(),
  password: z.string(),
  organizationName: z.string()
});

const SignInSchema = z.object({
  username: z.string(),
  password: z.string()
});

const CourseSchema = z.object({
  courseName: z.string(),
  description: z.string(),
});

const LearnerSchema = z.object({
  learnerName: z.string(),
  username: z.string(),
  courseId: z.string()
});

export type SignUpState = {
  errors?: {
    OrganizationName?: string[];
    username?: string[];
    password?: string[];
  };
  message: string ;
  status: number;
  prevState?: SignUpState
  
} | undefined;

export type SignInState = {
  errors?: {
    username?: string[];
    password?: string[];
  };
  message: string ;
  status: number;
  prevState?: SignInState;
} | undefined;

export type courseCreateState = {
  errors?: {
    courseName?: string[];
    description?: string[];
  };
  message: string ;
  status: number;
  prevState?: courseCreateState;
}

export type learnerAddState = {
  errors?: {
    learnerName?: string[];
    learnerEmail?: string[];
  };
  message: string ;
  status: number;
  prevState?: learnerAddState;
}

export async function signUp(prevState: SignUpState, formData: FormData): Promise<SignUpState>  {
  //validate using zod
  const validatedFields = FormScema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
    organizationName: formData.get('organizationName')
  });

  if(!validatedFields.success){
    return { 
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data', 
      status: 400 };
  }
  const { username, password, organizationName } = validatedFields.data;

  // if (!username || !password || !organizationName) {
  //   return { message: 'Username, password, and organization name are required', status: 400 };
  // }
  //username must be email format
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(username)) {
  //   return { message: 'Username should be an email ' , status: 400 };
  // }
  try{
    await dbConnect();
    const exists = await User.findOne({ username });
    if (exists){
      console.log('user exists');
      return { message: 'User exists' , status: 409}
    };
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed, role:'organization', organizationName });
    console.log('user created')
    return { message: 'User created', status: 201 };
  }catch(err){
    console.log(err)
  }
  
}

export async function signIn(prevState: SignInState, formData: FormData) {
  //validate using zod
  const validatedFields = SignInSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if(!validatedFields.success){
    return { 
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data', 
      status: 400 
    };
  }
  const { username, password } = validatedFields.data;

  try{
    await dbConnect();
    const user: IUser | null = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { message: 'Invalid credentials', status: 401 };
    }
    if (user.role === 'organization' && !user.isApproved) {
      return { message: 'Your organization account is not approved yet', status: 403 };
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const allCookies = await cookies();
    allCookies.set('token', token , {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    allCookies.set('role', user.role, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return { message: 'User logged in', status: 200 };
  }catch(err){
    console.log(err)
  }

}

export async function signOut() {
  const allCookies = await cookies();
  allCookies.delete('token');
  allCookies.delete('role');
  return { message: 'User logged out', status: 200 };
}

export async function createCourse(prevState : courseCreateState, formData: FormData) {
  // validate form data
  const validatedFields = CourseSchema.safeParse({
    courseName: formData.get('courseName'),
    description: formData.get('description')
  });

  if(!validatedFields.success){
    return { 
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data', 
      status: 400 
    };
  }
  // verify token
  const allCookies = await cookies();
  const token = allCookies.get('token')?.value;
  if (!token) return { message: 'Unauthorized', status: 401 };
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (payload.role !== 'organization') return { message: 'Forbidden', status: 403 };
    await dbConnect();
    await Course.create({ courseName: validatedFields.data.courseName, description: validatedFields.data.description, organizationId: payload.userId });
    revalidatePath('/dashboard');
    return { message: 'Course added', status: 201  };
    
  } catch (error) {
    console.error('Error adding course:', error);
    return { message: 'Internal Server Error', status: 500 };
  }

}

export async function addLearner(prevState : learnerAddState, formData: FormData) {
  // validate form data
  const validatedFields = LearnerSchema.safeParse({
    learnerName: formData.get('learnerName'),
    username: formData.get('username'),
    courseId: formData.get('courseId')
  });

  if(!validatedFields.success){
    return { 
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data', 
      status: 400 
    };
  }
  const { learnerName, username, courseId } = validatedFields.data;
  // verify token
  const allCookies = await cookies();
  const token = allCookies.get('token')?.value;
  if (!token) return { message: 'Unauthorized', status: 401 };
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (!payload || payload.role !== 'organization') return { message: 'Forbidden', status: 403 };
    await dbConnect();
    const course = await Course.findOne({ _id:  courseId, organizationId: payload.userId });
    if (!course) return { message: 'Course not found', status: 404 };
    let user = await User.findOne({ username });
    if (!user) {
      const hashedPassword = await bcrypt.hash( 'Password123',10 );
      user = await User.create({  learnerName, username, role: 'learner', password: hashedPassword });
    }else if(course.learners.includes(user._id)){
      return { message: 'Learner already added', status: 409 };  
    }
    course.learners.push(user._id);
    await course.save();

    revalidatePath('/dashboard');

    return { message: 'Learner added', status: 201  };
    
  } catch (error) {
    console.error('Error adding learner:', error);
    return { message: 'Internal Server Error', status: 500 };
  }

}

export async function updateOrgStatus(userId: string) {
  const allCookies = await cookies();
  const token = allCookies.get('token')?.value;
  if (!token) return { message: 'Unauthorized', status: 401 };
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (payload.role !== 'admin') return { message: 'Forbidden', status: 403 };
    await dbConnect();
    const user = await User.findOne({ _id: userId });
    if (!user) return { message: 'User not found', status: 404 };
    user.isApproved = !user.isApproved;
    await user.save();
    revalidatePath('admin/dashboard');
    return { message: 'Organization status updated', status: 200 };
  } catch (error) {
    console.error('Error updating organization status:', error);
    return { message: 'Internal Server Error', status: 500 };
  }
}
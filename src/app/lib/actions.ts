'use server'

import { dbConnect } from '@/lib/mongodb';
import User, { IUser, UserRole } from '@/models/User';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET as string;

const FormScema = z.object({
  username: z.string().email(),
  password: z.string(),
  organizationName: z.string()
});

const SignInSchema = z.object({
  username: z.string(),
  password: z.string()
})

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
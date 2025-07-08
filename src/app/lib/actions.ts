'use server'

import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const FormScema = z.object({
  username: z.string().email(),
  password: z.string(),
  organizationName: z.string()
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
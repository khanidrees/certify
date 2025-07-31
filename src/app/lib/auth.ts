import JWT  from 'jsonwebtoken';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await JWT.sign(payload, secretKey, {
    algorithm: 'HS256',
    expiresIn: '24h', // 24 hours
  });
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await JWT.verify(input, secretKey, {
    algorithms: ['HS256'],
  }) as { payload: any };
  return payload;
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const token = await encrypt({ userId, role });
    const allCookies = await cookies();
   allCookies.set('token', token, {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  allCookies.set('role', role, {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

export async function getSession() {
  const session =  (await cookies()).get('token')?.value;
  if (!session) return null;
  
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function deleteSession() {
  const allCookies = await cookies();
  allCookies.set('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  allCookies.set('role', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface JwtPayload {
  userId: string;
  role: 'admin' | 'organization' | 'learner';
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Verifies the Bearer token in the Authorization header.
 * Throws AuthError (401/403) on failure so routes can catch it uniformly.
 */
export function verifyToken(req: NextRequest | Request): JwtPayload {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    throw new AuthError('Unauthorized', 401);
  }
  const token = auth.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new AuthError('Invalid or expired token', 401);
  }
}

/**
 * Like verifyToken, but also asserts the required role.
 */
export function verifyRole(
  req: NextRequest | Request,
  requiredRole: JwtPayload['role']
): JwtPayload {
  const payload = verifyToken(req);
  if (payload.role !== requiredRole) {
    throw new AuthError('Forbidden', 403);
  }
  return payload;
}

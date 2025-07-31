import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { createSession } from '@/app/lib/auth';
import User from '@/models/User';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '/dashboard';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('No payload in ID token');
    }

    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists in your database
    const existingUser = await User.findOne({username: email});
    
    let user;
    if (existingUser) {
      // Link Google account to existing user
      user = await linkGoogleAccount(existingUser.id, googleId!, email!);
    } else {
      // Create new user
      user = new User({
        username: email,
        name: name,
        organizationName: "Default Organization", // Set default organization name
        role: 'organization', // Default role, adjust as needed
        avatar: picture,
        googleId: googleId,
        authProvider: 'google',
        isApproved: true, // Automatically approve for demo purposes
      });
      await user.save();
      console.log('New user created:', user);
    }

    // Create your custom JWT session
    await createSession(user?._id.toString()!, user?.role!);

    return NextResponse.redirect(new URL(state, request.url));
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_error', request.url));
  }
}

// Database helper functions (implement based on your database)
async function findUserByEmail(email: string) {
  // Implement your database query to find user by email
  // Return user object if found, null if not found
}

async function linkGoogleAccount(userId: string, googleId: string, email: string) {
  // Update existing user record to include Google ID
  // This prevents duplicate accounts for existing users
  return User.findByIdAndUpdate(userId, {
    googleId: googleId,
    username: email,
    authProvider: 'google',
  }, { new: true });
}

async function createUser(userData: any) {
  // Create new user in your database
  // Return the created user object
  
}

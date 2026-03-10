import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        // Verify password using bcrypt
        if (!user.password) {
          return null;
        }

        const isPasswordValid = await verifyPassword(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id || token.sub!;
        
        // Fetch fresh user data from database to get updated profile image
        try {
          const userId = String(token.id || token.sub!);
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { image: true }
          });
          if (dbUser?.image) {
            (session.user as any).image = dbUser.image;
          }
        } catch (error) {
          // If fetching fails, continue with existing image
          console.error('Error fetching user image:', error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/auth/login',
    error: (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/auth/login', // Redirect errors to login page
  },
};

// Helper functions
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(userData: {
  email: string;
  name: string;
  password: string;
}) {
  const hashedPassword = await hashPassword(userData.password);
  
  return prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      // Note: In a real app, you'd store the hashed password
      // For demo purposes, we're not storing passwords
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUserProfile(userId: string, data: {
  name?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  image?: string;
}) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}


import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { loginSchema } from "@/schema/auth";
import { ZodError } from "zod";
import { type JWT } from "next-auth/jwt";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          // Check if user exists
          let user = await db.user.findUnique({
            where: {
              email: email,
            },
          });

          if (user) {
            // Existing user - verify password
            if (!user.password) {
              return null;
            }

            if (!user.password) {
              return null;
            }
            
            const validPassword = await bcrypt.compare(
              password,
              user.password as string,
            );

            if (!validPassword) {
              return null;
            }
          } else {
            // New user - create account
            const hashedPassword = await bcrypt.hash(password, 12);
            
            user = await db.user.create({
              data: {
                email: email,
                password: hashedPassword,
                name: email.split('@')[0], // Use email prefix as default name
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          console.error('Auth error:', error);
        }
        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/signin",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

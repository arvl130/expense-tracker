import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/server/db"

if (!process.env.GOOGLE_CLIENT_ID) throw new Error("Missing Google client ID")
if (!process.env.GOOGLE_CLIENT_SECRET)
  throw new Error("Missing Google client secret")
if (!process.env.NEXTAUTH_SECRET) throw new Error("Missing Next Auth secret")

export const authOptions: NextAuthOptions = {
  // Include user.id in session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)

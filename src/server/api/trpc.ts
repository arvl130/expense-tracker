import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"
import { getServerSession } from "next-auth"
import SuperJSON from "superjson"
import { prisma } from "../db"
import { client as s3 } from "../s3"

export async function createContext({ req, res }: CreateNextContextOptions) {
  const session = await getServerSession(req, res, authOptions)

  return {
    s3,
    prisma,
    user: session?.user,
  }
}

type CreateContextType = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<CreateContextType>().create({
  transformer: SuperJSON,
})

// Base router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure

const hasUser = t.middleware(({ ctx: { user }, next }) => {
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      user,
    },
  })
})

export const protectedProcedure = t.procedure.use(hasUser)

import { TRPCError } from "@trpc/server"
import { protectedProcedure, router } from "../trpc"
import {
  GetTransactionSchema,
  CreateTransactionSchema,
  EditTransactionSchema,
  DeleteTransactionSchema,
} from "@/models/transaction"

export const transactionsRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        accomplishedAt: "desc",
      },
    })
  }),
  get: protectedProcedure
    .input(GetTransactionSchema)
    .query(async ({ input, ctx }) => {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: {
          id: input.id,
        },
        include: {
          transactionImage: true,
        },
      })

      if (!transaction)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      // Users can only query their own transaction.
      if (transaction.userId !== ctx.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        })

      return transaction
    }),
  create: protectedProcedure
    .input(CreateTransactionSchema)
    .mutation(({ ctx, input }) => {
      // Users can only create their own transactions.
      if (ctx.user.id !== input.userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        })

      return ctx.prisma.transaction.create({
        data: {
          accomplishedAt: input.accomplishedAt,
          description: input.description,
          amount: input.amount,
          userId: input.userId,
          operation: input.operation,
        },
      })
    }),
  edit: protectedProcedure
    .input(EditTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: {
          id: input.id,
        },
      })

      if (!transaction)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      // Users can only edit their own transactions.
      if (transaction.userId !== ctx.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        })

      return ctx.prisma.transaction.update({
        where: {
          id: input.id,
        },
        data: {
          accomplishedAt: input.accomplishedAt,
          description: input.description,
          amount: input.amount,
          userId: input.userId,
          operation: input.operation,
        },
      })
    }),
  delete: protectedProcedure
    .input(DeleteTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: {
          id: input.id,
        },
      })

      if (!transaction)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      // Users can only delete their own transactions.
      if (transaction.userId !== ctx.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        })

      return ctx.prisma.transaction.delete({
        where: {
          id: input.id,
        },
      })
    }),
})

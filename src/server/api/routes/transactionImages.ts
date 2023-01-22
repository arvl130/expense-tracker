import { TRPCError } from "@trpc/server"
import { protectedProcedure, router } from "../trpc"
import {
  CreateTransactionImageSchema,
  DeleteTransactionImageSchema,
  GetUploadUrlSchema,
} from "@/models/transactionImage"
import { deleteObject, getUploadUrl } from "@/server/s3"

export const transactionImagesRouter = router({
  create: protectedProcedure
    .input(CreateTransactionImageSchema)
    .mutation(async ({ ctx, input }) => {
      // Get the user of the transaction we are adding to.
      const transaction = await ctx.prisma.transaction.findUnique({
        where: {
          id: input.transactionId,
        },
      })

      if (!transaction)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid transaction",
        })

      // Users can only add images to their transactions.
      if (ctx.user.id !== transaction.userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        })

      return ctx.prisma.transactionImage.create({
        data: input,
      })
    }),
  delete: protectedProcedure
    .input(DeleteTransactionImageSchema)
    .mutation(async ({ ctx, input }) => {
      const transactionImage = await ctx.prisma.transactionImage.findUnique({
        where: {
          id: input.id,
        },
      })

      if (!transactionImage)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No such transaction image",
        })

      // Get the user of the transaction we are adding to.
      const transaction = await ctx.prisma.transaction.findUnique({
        where: {
          id: transactionImage.transactionId,
        },
      })

      if (!transaction)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No such transaction",
        })

      // Users can only delete images on their own transactions.
      if (ctx.user.id !== transaction.userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        })

      await ctx.prisma.transactionImage.delete({
        where: {
          id: input.id,
        },
      })

      return deleteObject(ctx.s3, transactionImage.path)
    }),
  getUploadUrl: protectedProcedure
    .input(GetUploadUrlSchema)
    .mutation(({ ctx, input: { fileType, byteLength } }) => {
      return getUploadUrl(ctx.s3, ctx.user.id, fileType, byteLength)
    }),
})

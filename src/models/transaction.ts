import { Transaction, TransactionImage } from "@prisma/client"
import { z } from "zod"
import {
  CANNOT_BE_EMPTY,
  INVALID_DATE,
  NUMBER_EXPECTED,
  POSITIVE_ONLY,
} from "./validation-messages"

export const GetTransactionsSchema = z.object({
  userId: z.string().cuid(),
})

export type GetTransactionsType = z.infer<typeof GetTransactionsSchema>

export const GetTransactionSchema = z.object({
  id: z.string().uuid(),
})

export type GetTransactionType = z.infer<typeof GetTransactionSchema>

const VALID_DATETIME_LOCAL_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

export const CreateTransactionSchema = z.object({
  userId: z.string().cuid(),
  accomplishedAt: z.string().regex(VALID_DATETIME_LOCAL_REGEX, {
    message: INVALID_DATE,
  }),
  description: z.string().min(1, {
    message: CANNOT_BE_EMPTY,
  }),
  operation: z.union([z.literal("ADD"), z.literal("SUB")]),
  amount: z
    .number({
      invalid_type_error: NUMBER_EXPECTED,
    })
    .positive({
      message: POSITIVE_ONLY,
    })
    .finite(),
})

export type CreateTransactionType = z.infer<typeof CreateTransactionSchema>

export const EditTransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().cuid(),
  accomplishedAt: z.string().regex(VALID_DATETIME_LOCAL_REGEX, {
    message: INVALID_DATE,
  }),
  description: z.string().min(1, {
    message: CANNOT_BE_EMPTY,
  }),
  operation: z.union([z.literal("ADD"), z.literal("SUB")]),
  amount: z
    .number({
      invalid_type_error: NUMBER_EXPECTED,
    })
    .positive({
      message: POSITIVE_ONLY,
    })
    .finite(),
})

export type EditTransactionType = z.infer<typeof EditTransactionSchema>

export const DeleteTransactionSchema = z.object({
  id: z.string().uuid(),
})

export type DeleteTransactionType = z.infer<typeof GetTransactionSchema>

export const ImportTransactionsSchema = z.object({
  transactions: z.custom<Transaction[]>(),
  transactionImages: z.custom<TransactionImage[]>(),
})

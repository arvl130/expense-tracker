import { z } from "zod"
import {
  CANNOT_BE_EMPTY,
  INVALID_DATE,
  NUMBER_EXPECTED,
  POSITIVE_OR_NEGATIVE,
} from "./validation-messages"

export const GetTransactionsSchema = z.object({
  userId: z.string().cuid(),
})

export type GetTransactionsType = z.infer<typeof GetTransactionsSchema>

export const GetTransactionSchema = z.object({
  id: z.string().uuid(),
})

export type GetTransactionType = z.infer<typeof GetTransactionSchema>

export const CreateTransactionSchema = z.object({
  userId: z.string().cuid(),
  accomplishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: INVALID_DATE,
  }),
  description: z.string().min(1, {
    message: CANNOT_BE_EMPTY,
  }),
  amount: z.union([
    z
      .number({
        invalid_type_error: NUMBER_EXPECTED,
      })
      .positive({
        message: POSITIVE_OR_NEGATIVE,
      })
      .finite(),
    z
      .number({
        invalid_type_error: NUMBER_EXPECTED,
      })
      .negative({
        message: POSITIVE_OR_NEGATIVE,
      })
      .finite(),
  ]),
})

export type CreateTransactionType = z.infer<typeof CreateTransactionSchema>

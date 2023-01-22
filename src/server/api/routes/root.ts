import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { transactionsRouter } from "./transaction"
import { transactionImagesRouter } from "./transactionImages"

export const rootRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      }
    }),
  transactions: transactionsRouter,
  transactionImages: transactionImagesRouter,
})

// export type definition of API
export type RootRouter = typeof rootRouter

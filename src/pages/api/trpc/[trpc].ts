import { rootRouter } from "@/server/api/routes/root"
import { createNextApiHandler } from "@trpc/server/adapters/next"
import { createContext } from "@/server/api/trpc"

export default createNextApiHandler({
  router: rootRouter,
  createContext,
})

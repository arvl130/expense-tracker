import Loading from "@/components/Loading"
import Link from "next/link"
import { useRedirectOnUnauthenticated } from "@/hooks/useRedirect"
import { api } from "@/utils/api"

export default function Home() {
  const { status, session } = useRedirectOnUnauthenticated()

  const { data: transactions, isLoading } = api.transactions.getAll.useQuery(
    {
      userId: session?.user?.id as string,
    },
    {
      enabled: !!session?.user?.id,
    }
  )

  if (status !== "authenticated") return <Loading />

  if (isLoading)
    return (
      <main className="max-w-6xl mx-auto p-6 grid grid-rows-[auto_1fr]">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <div>
            <Link
              href="/transactions/create"
              className="px-4 py-2 rounded-md border border-gray-300 text-zinc-800 hover:bg-zinc-100 transition duration-200 font-medium"
            >
              Create
            </Link>
          </div>
        </div>
        <div className="text-center mt-12">Loading transaction ...</div>
      </main>
    )

  if (!transactions)
    return (
      <main className="max-w-6xl mx-auto p-6 grid grid-rows-[auto_1fr]">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <div>
            <Link
              href="/transactions/create"
              className="px-4 py-2 rounded-md border border-gray-300 text-zinc-800 hover:bg-zinc-100 transition duration-200 font-medium"
            >
              Create
            </Link>
          </div>
        </div>
        <div className="text-center mt-12">
          Transactions could not be retrieved. {")"}:
        </div>
      </main>
    )

  return (
    <main className="max-w-6xl mx-auto h-full p-6 grid grid-rows-[auto_auto_1fr]">
      <div className="flex justify-between mb-3">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <div className="flex">
          <Link
            href="/transactions/create"
            className="px-4 py-2 rounded-md border border-gray-300 text-zinc-800 hover:bg-zinc-100 transition duration-200 font-medium"
          >
            Create
          </Link>
        </div>
      </div>
      <div className="max-w-2xl mx-auto w-full mb-3">
        <div>
          <span className="font-medium">Total</span>: ₱
          {transactions.reduce((prevValue, currTransaction) => {
            if (currTransaction.operation === "ADD")
              return prevValue + currTransaction.amount

            return prevValue - currTransaction.amount
          }, 0)}
        </div>
      </div>
      <div>
        <div className="max-w-2xl mx-auto grid grid-cols-[10rem_1fr] gap-2 bg-zinc-600 text-white px-4 py-2 font-medium">
          <div>Date</div>
          <div>Amount</div>
        </div>
        {transactions.map((transaction) => {
          return (
            <div
              key={transaction.id}
              className="max-w-2xl mx-auto grid grid-cols-[10rem_1fr_4rem] gap-2 px-4 py-2 border-b border-gray-300"
            >
              <div>{transaction.accomplishedAt}</div>
              <div>₱{transaction.amount}</div>
              <div className="text-center">
                <Link
                  href={`/transactions/${transaction.id}/view`}
                  className="font-medium text-blue-500 hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

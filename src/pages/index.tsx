import Loading from "@/components/Loading"
import Link from "next/link"
import { useRedirectOnUnauthenticated } from "@/hooks/useRedirect"
import { api } from "@/utils/api"
import { format } from "date-fns"

function TransactionsList({ userId }: { userId: string }) {
  const { data: transactions, isLoading } = api.transactions.getAll.useQuery(
    {
      userId,
    },
    {
      enabled: !!userId,
    }
  )

  function formatDate(dateStr: string) {
    return format(new Date(dateStr), "y-MMM-dd K:m'\u00A0'a")
  }

  if (isLoading)
    return <div className="text-center mt-12">Loading transaction ...</div>

  if (!transactions)
    return (
      <div className="text-center mt-12">
        Transactions could not be retrieved. {")"}:
      </div>
    )

  return (
    <>
      {transactions.length > 0 ? (
        <>
          <div className="max-w-2xl mx-auto w-full mb-2">
            <div className="sm:flex justify-between">
              <div className="flex gap-2 items-baseline">
                <span className="font-medium">TOTAL:</span>{" "}
                <span className="font-semibold text-2xl sm:text-3xl">
                  {transactions.length}
                </span>
              </div>
              <div className="flex gap-2 items-baseline">
                <span className="font-medium">CURRENT FUNDS:</span>
                <span className="font-semibold text-2xl sm:text-3xl">
                  ₱
                  {transactions.reduce((prevValue, currTransaction) => {
                    if (currTransaction.operation === "ADD")
                      return prevValue + currTransaction.amount

                    return prevValue - currTransaction.amount
                  }, 0)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="max-w-2xl mx-auto grid grid-cols-[minmax(0,_10rem)_1fr_4rem] gap-2 bg-zinc-600 text-white px-4 py-2 font-medium">
              <div>Date</div>
              <div>Amount</div>
            </div>
            {transactions.map((transaction) => {
              return (
                <div
                  key={transaction.id}
                  className="max-w-2xl mx-auto grid grid-cols-[minmax(0,_10rem)_1fr_4rem] gap-2 px-4 py-2 border-b border-gray-300"
                >
                  <div>{formatDate(transaction.accomplishedAt)}</div>
                  <div
                    className={
                      transaction.operation === "ADD"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {transaction.operation === "ADD" ? "+" : "-"}&nbsp;₱
                    {transaction.amount}
                  </div>
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
        </>
      ) : (
        <div className="text-center pt-14">
          <p className="mb-4 font-medium">No transactions found.</p>
          <p>
            Click the{" "}
            <Link
              className="font-semibold text-blue-500 hover:underline"
              href="/transactions/create"
            >
              Create
            </Link>{" "}
            button to create a transaction.
          </p>
        </div>
      )}
    </>
  )
}

export default function Home() {
  const { status, session } = useRedirectOnUnauthenticated()
  const userId = session?.user?.id as string

  if (status !== "authenticated") return <Loading />

  return (
    <main className="max-w-6xl mx-auto h-full p-6 grid grid-rows-[auto_auto_1fr]">
      <div className="flex justify-between mb-3">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <Link href="/settings" className="hover:underline">
            Settings »
          </Link>
        </div>
        <div className="flex items-start">
          <Link
            href="/transactions/create"
            className="px-4 py-2 rounded-md border border-gray-300 text-zinc-800 hover:bg-zinc-100 transition duration-200 font-medium"
          >
            Create
          </Link>
        </div>
      </div>
      <TransactionsList userId={userId} />
    </main>
  )
}

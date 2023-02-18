import { EditIcon, TrashIcon } from "@/components/Icon"
import Loading from "@/components/Loading"
import { useRedirectOnUnauthenticated } from "@/hooks/useRedirect"
import { api } from "@/utils/api"
import { TransactionImage } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { format } from "date-fns"

function TransactionImage({
  image,
  transactionId,
  reload,
}: {
  image: TransactionImage
  transactionId: string
  reload: () => void
}) {
  const { mutate: deleteTransaction } =
    api.transactionImages.delete.useMutation({
      onSettled: reload,
    })

  return (
    <div className="grid gap-2 grid-rows-[24rem_auto]">
      <Image
        src={`${process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL}/${image.path}`}
        alt={`Image for receipt titled '${image.title}'`}
        width={400}
        height={300}
        className="w-full h-full object-cover bg-gray-100 text-center flex justify-center items-center"
      />
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <p
          className="overflow-hidden text-ellipsis"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          }}
        >
          {image.title}
        </p>
        <div className="flex gap-2">
          <div>
            <Link
              className="inline-block p-2 border border-gray-300 rounded-md hover:bg-zinc-100 transition duration-100"
              href={`/transactions/${transactionId}/receipts/${image.id}/edit`}
            >
              <EditIcon />
            </Link>
          </div>
          <div>
            <button
              type="button"
              className="p-2 border border-gray-300 rounded-md hover:bg-zinc-100 transition duration-100"
              onClick={() => {
                deleteTransaction({
                  id: image.id,
                })
              }}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ViewTransaction() {
  const { query } = useRouter()
  const transactionId = query.id as string

  const {
    data: transaction,
    isLoading,
    refetch: refetchTransactions,
  } = api.transactions.get.useQuery(
    {
      id: transactionId,
    },
    {
      enabled: !!transactionId,
    }
  )

  function formatDate(dateStr: string) {
    return format(new Date(dateStr), "EEE LLL d, y K:mm'\u00A0'a")
  }

  const { status } = useRedirectOnUnauthenticated()
  if (status !== "authenticated") return <Loading />

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold">View Transaction</h2>
          <Link href="/" className="hover:underline">
            « Back
          </Link>
        </div>
        {transaction && (
          <div>
            <Link
              href={`/transactions/${transactionId}/edit`}
              className="inline-block px-4 py-2 rounded-md border border-gray-300 text-zinc-800 hover:bg-zinc-100 transition duration-200 font-medium"
            >
              Edit
            </Link>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="text-center">Loading transaction ...</div>
      ) : (
        <>
          {!transaction ? (
            <div className="text-center">
              Transaction could not be retrieved. {")"}:
            </div>
          ) : (
            <>
              <div className="max-w-xl mx-auto">
                <div className="grid grid-cols-[7rem_1fr] gap-2 mb-3">
                  <div className="font-medium text-right">Date:</div>
                  <div>{formatDate(transaction.accomplishedAt)}</div>
                </div>
                <div className="grid grid-cols-[7rem_1fr] gap-2 mb-3">
                  <div className="font-medium text-right">Amount:</div>
                  <div
                    className={
                      transaction.operation === "ADD"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    ₱{transaction.amount}{" "}
                    {transaction.operation === "ADD" ? "++" : "--"}
                  </div>
                </div>
                <div className="grid grid-cols-[7rem_1fr] gap-2 mb-3">
                  <div className="font-medium text-right">Description:</div>
                </div>
                <div className="border border-gray-400 px-4 py-2 min-h-[12rem] mb-3">
                  {transaction.description}
                </div>
                <div className="grid mb-3">
                  <div className="flex justify-between items-center font-medium mb-3">
                    <div>Receipts:</div>
                    <div>
                      <Link
                        href={`/transactions/${query.id}/receipts/add`}
                        className="inline-block px-4 py-2 rounded-md border border-gray-300 text-zinc-800 hover:bg-zinc-100 transition duration-200 font-medium"
                      >
                        Add
                      </Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {transaction.transactionImage.map((image) => {
                      return (
                        <TransactionImage
                          key={image.id}
                          transactionId={query.id as string}
                          image={image}
                          reload={() => {
                            refetchTransactions()
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

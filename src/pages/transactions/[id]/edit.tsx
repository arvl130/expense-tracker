import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  EditTransactionSchema,
  EditTransactionType,
} from "@/models/transaction"
import Loading from "@/components/Loading"
import { useRedirectOnUnauthenticated } from "@/hooks/useRedirect"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { DeleteDialog } from "@/components/Dialog"
import { useState } from "react"

export default function EditTransaction() {
  const router = useRouter()
  const { query } = router

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EditTransactionType>({
    resolver: zodResolver(EditTransactionSchema),
  })

  const utils = api.useContext()
  const { mutate: editTransaction } = api.transactions.edit.useMutation({
    onSuccess: () => {
      // Invalidate query cache for this transaction.
      utils.transactions.get.invalidate({
        id: query.id as string,
      })

      router.push(`/transactions/${query.id}/view`)
    },
  })

  const { mutate: deleteTransaction } = api.transactions.delete.useMutation({
    onSuccess: () => {
      router.push(`/`)
    },
  })

  const { data: transaction, isLoading: isLoadingTransaction } =
    api.transactions.get.useQuery(
      {
        id: query.id as string,
      },
      {
        enabled: !!query.id,
      }
    )

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false)

  const { status, session } = useRedirectOnUnauthenticated()
  if (status !== "authenticated") return <Loading />

  return (
    <form
      className="max-w-6xl mx-auto p-6"
      onSubmit={handleSubmit((formData) => {
        editTransaction(formData)
      })}
    >
      <div className="flex justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold">Edit Transaction</h2>
          <Link
            href={`/transactions/${query.id}/view`}
            className="hover:underline"
          >
            « Back
          </Link>
        </div>
        {transaction && (
          <div>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-400 transition duration-200 font-medium"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {isLoadingTransaction ? (
        <div className="text-center mt-12">Loading transaction ...</div>
      ) : (
        <>
          {!transaction ? (
            <div className="text-center mt-12">
              Transaction could not be retrieved. {")"}:
            </div>
          ) : (
            <>
              <div className="max-w-xl mx-auto">
                <input
                  type="hidden"
                  {...register("id")}
                  defaultValue={query.id}
                />
                <input
                  type="hidden"
                  {...register("userId")}
                  defaultValue={session?.user?.id}
                />
                <div className="grid mb-3">
                  <label className="font-medium mb-1">
                    Date <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300/40"
                    {...register("accomplishedAt")}
                    defaultValue={transaction.accomplishedAt}
                  />
                  {errors.accomplishedAt && (
                    <span className="text-red-500 mt-1">
                      {errors.accomplishedAt.message}
                    </span>
                  )}
                </div>
                <div className="grid mb-3">
                  <label className="font-medium mb-1">
                    Description{" "}
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300/40"
                    placeholder="Some important details ..."
                    {...register("description")}
                    defaultValue={transaction.description}
                  />
                  {errors.description && (
                    <span className="text-red-500 mt-1">
                      {errors.description.message}
                    </span>
                  )}
                </div>
                <div className="grid mb-3">
                  <label className="font-medium mb-1">
                    Operation <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300/40"
                    {...register("operation")}
                    defaultValue={transaction.operation}
                  >
                    <option value={"ADD"}>Add</option>
                    <option value={"SUB"}>Subtract</option>
                  </select>
                  {errors.operation && (
                    <span className="text-red-500 mt-1">
                      {errors.operation.message}
                    </span>
                  )}
                </div>
                <div className="grid mb-3">
                  <label className="font-medium mb-1">
                    Amount (₱) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300/40"
                    min={1}
                    step={0.01}
                    defaultValue={transaction.amount.toNumber()}
                    {...register("amount", {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.amount && (
                    <span className="text-red-500 mt-1">
                      {errors.amount.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center pt-14">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-200 font-medium"
                  onClick={(e) => {
                    setIsDeleteDialogVisible(true)
                  }}
                >
                  Delete Transaction
                </button>
                {isDeleteDialogVisible && (
                  <DeleteDialog
                    closeFn={() => {
                      setIsDeleteDialogVisible(false)
                    }}
                    actionFn={() => {
                      deleteTransaction({
                        id: query.id as string,
                      })
                    }}
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
    </form>
  )
}

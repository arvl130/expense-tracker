import Loading from "@/components/Loading"
import Link from "next/link"
import { useRedirectOnUnauthenticated } from "@/hooks/useRedirect"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateTransactionSchema,
  CreateTransactionType,
} from "@/models/transaction"
import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { useRef } from "react"

export default function Home() {
  const uploadRef = useRef<null | HTMLInputElement>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransactionType>({
    resolver: zodResolver(CreateTransactionSchema),
  })

  const { mutate: createTransaction } = api.transactions.create.useMutation({
    onSuccess: () => {
      router.push("/")
    },
  })

  const { status, session } = useRedirectOnUnauthenticated()
  if (status !== "authenticated") return <Loading />

  return (
    <form
      className="max-w-6xl mx-auto p-6"
      onSubmit={handleSubmit(async (formData) => {
        createTransaction(formData)
      })}
    >
      <div className="flex justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold">Create Transaction</h2>
          <Link href="/" className="hover:underline">
            « Back
          </Link>
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-400 transition duration-200 font-medium"
          >
            Create
          </button>
        </div>
      </div>
      <div className="max-w-xl mx-auto">
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
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300/40"
            {...register("accomplishedAt")}
          />
          {errors.accomplishedAt && (
            <span className="text-red-500 mt-1">
              {errors.accomplishedAt.message}
            </span>
          )}
        </div>
        <div className="grid mb-3">
          <label className="font-medium mb-1">
            Description <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300/40"
            placeholder="Enter some details ..."
            {...register("description")}
          />
          {errors.description && (
            <span className="text-red-500 mt-1">
              {errors.description.message}
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
            defaultValue={0}
            {...register("amount", {
              valueAsNumber: true,
            })}
          />
          {errors.amount && (
            <span className="text-red-500 mt-1">{errors.amount.message}</span>
          )}
        </div>
      </div>
    </form>
  )
}

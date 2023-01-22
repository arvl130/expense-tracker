import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  CreateTransactionImageFormType,
  CreateTransactionImageFormSchema,
  SupportedUploadType,
} from "@/models/transactionImage"
import Loading from "@/components/Loading"
import { useRedirectOnUnauthenticated } from "@/hooks/useRedirect"
import { api } from "@/utils/api"

export default function AddReceipt() {
  const { query } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransactionImageFormType>({
    resolver: zodResolver(CreateTransactionImageFormSchema),
  })

  const { mutateAsync: getUploadUrl } =
    api.transactionImages.getUploadUrl.useMutation()

  const router = useRouter()
  const { mutate: createTransactionImage } =
    api.transactionImages.create.useMutation({
      onSuccess: () => {
        router.push(`/transactions/${query.id}/view`)
      },
    })

  const { status } = useRedirectOnUnauthenticated()
  if (status !== "authenticated") return <Loading />

  return (
    <form
      className="max-w-6xl mx-auto p-6"
      onSubmit={handleSubmit(async ({ files, title, transactionId }) => {
        // Form schema guarantees there is only one file here.
        const file = files[0]

        const { key, signedUrl } = await getUploadUrl({
          // Form schema already guarantees the type of this
          // property, so we can assert this here.
          fileType: file.type as SupportedUploadType,
          byteLength: file.size,
        })

        const response = await fetch(signedUrl, {
          method: "PUT",
          body: file,
        })

        if (!response.ok)
          throw new Error(`File could not be uploaded: ${file.name}`)

        createTransactionImage({
          title,
          transactionId,
          path: key,
        })
      })}
    >
      <div className="flex justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold">Add Receipt</h2>
          <Link
            href={`/transactions/${query.id}/view`}
            className="hover:underline"
          >
            « Back
          </Link>
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-400 transition duration-200 font-medium"
          >
            Add
          </button>
        </div>
      </div>
      <div className="max-w-xl mx-auto">
        <input
          type="hidden"
          {...register("transactionId")}
          defaultValue={query.id as string}
        />
        <div className="grid mb-3">
          <label className="font-medium mb-1">
            Title <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300/40"
            placeholder="Enter a meaningful title ..."
            {...register("title")}
          />
          {errors.title && (
            <span className="text-red-500 mt-1">{errors.title.message}</span>
          )}
        </div>
        <div className="grid mb-3">
          <label className="font-medium mb-1">
            Receipt <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300/40"
            {...register("files")}
          />
          <p className="text-sm mt-1">
            Only files up to 4MiB only are allowed.
          </p>
          {errors.files && (
            <span className="text-red-500">{errors.files.message}</span>
          )}
        </div>
      </div>
    </form>
  )
}

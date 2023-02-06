import Loading from "@/components/Loading"
import Link from "next/link"
import { useRedirectOnUnauthenticated } from "@/hooks/useRedirect"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  EditTransactionImageFormSchema,
  EditTransactionImageFormType,
  SupportedUploadType,
} from "@/models/transactionImage"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import Image from "next/image"

export default function EditReceipt() {
  const router = useRouter()
  const { query } = router

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<EditTransactionImageFormType>({
    resolver: zodResolver(EditTransactionImageFormSchema),
  })

  const { data: transactionImage, isLoading: isLoadingTransactionImage } =
    api.transactionImages.get.useQuery(
      {
        id: query.receiptId as string,
      },
      {
        enabled: !!query.receiptId,
      }
    )

  const { mutateAsync: getUploadUrl } =
    api.transactionImages.getUploadUrl.useMutation()

  const { mutate: editTransactionImage } =
    api.transactionImages.edit.useMutation({
      onSuccess: () => {
        router.push(`/transactions/${query.id}/view`)
      },
    })

  const { status } = useRedirectOnUnauthenticated()
  if (status !== "authenticated") return <Loading />

  if (isLoadingTransactionImage)
    return (
      <div className="max-w-6xl mx-auto p-6">
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
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-400 transition duration-200 font-medium"
            >
              Edit
            </button>
          </div>
        </div>

        <div className="text-center mt-12">Loading transaction image ...</div>
      </div>
    )

  if (!transactionImage)
    return (
      <div className="max-w-6xl mx-auto p-6">
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
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-400 transition duration-200 font-medium"
            >
              Edit
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          Transaction image could not be retrieved. {")"}:
        </div>
      </div>
    )

  return (
    <form
      className="max-w-6xl mx-auto p-6"
      onSubmit={handleSubmit(async ({ id, files, title, transactionId }) => {
        if (files.length === 0) {
          editTransactionImage({
            id,
            title,
            transactionId,
            path: transactionImage.path,
          })
          return
        }

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

        editTransactionImage({
          id,
          title,
          transactionId,
          path: key,
        })
      })}
    >
      <div className="flex justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold">Edit Receipt</h2>
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
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-400 transition duration-200 font-medium"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        <input
          type="hidden"
          {...register("id")}
          defaultValue={query.receiptId as string}
        />
        <input
          type="hidden"
          {...register("transactionId")}
          defaultValue={transactionImage.transactionId}
        />
        <div className="grid mb-3">
          <label className="font-medium mb-1">
            Title <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300/40"
            placeholder="A meaningful title ..."
            {...register("title")}
            defaultValue={transactionImage.title}
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
            className="px-4 py-2 sm:border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300/40"
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

      <div className="max-w-sm mx-auto">
        <p className="font-medium text-center mb-1">Uploaded Image</p>
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL}/${transactionImage.path}`}
          alt={`Image for ${transactionImage.title}`}
          width={400}
          height={400}
        />
      </div>
    </form>
  )
}

import Loading from "@/components/Loading"
import { useRedirectOnUnauthenticated } from "@/hooks/useRedirect"
import { api } from "@/utils/api"
import Link from "next/link"

function OrphansSection() {
  const {
    data: orphans,
    isLoading,
    refetch,
  } = api.transactionImages.listOrphanedObjects.useQuery()

  const { mutate: clearOrphans, isLoading: isClearing } =
    api.transactionImages.clearOrphanedObjects.useMutation({
      onSettled: () => {
        refetch()
      },
    })

  if (isLoading)
    return (
      <section className="px-5 py-3 border border-gray-300 rounded-md shadow">
        <h3 className="font-semibold mb-1">Orphaned Files</h3>
        <p className="text-center">Checking ...</p>
      </section>
    )

  if (orphans === undefined)
    return (
      <section className="px-5 py-3 border border-gray-300 rounded-md shadow">
        <h3 className="font-semibold mb-1">Orphaned Files</h3>
        <p className="text-center">
          An error occured while checking for orphaned files.
        </p>
      </section>
    )

  return (
    <section className="px-5 py-3 border border-gray-300 rounded-md shadow">
      <h3 className="font-semibold mb-1">Orphaned Files</h3>
      {orphans === 0 ? (
        <p>No orphaned files found.</p>
      ) : (
        <article className="flex justify-between">
          <span>
            {orphans} orphaned {orphans > 1 ? "files" : "file"} found.
          </span>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-400 transition duration-200 font-medium disabled:bg-blue-300"
            disabled={isClearing}
            onClick={() => {
              clearOrphans()
            }}
          >
            Clear
          </button>
        </article>
      )}
    </section>
  )
}

export default function Settings() {
  const { status } = useRedirectOnUnauthenticated()

  if (status !== "authenticated") return <Loading />
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">Settings</h2>
        <Link href="/" className="hover:underline">
          « Back
        </Link>
      </div>
      <main>
        <OrphansSection />
      </main>
    </div>
  )
}

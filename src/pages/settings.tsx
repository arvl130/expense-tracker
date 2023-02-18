import Loading from "@/components/Loading"
import { useRef, useState } from "react"
import { useRouter } from "next/router"
import { Transaction, TransactionImage } from "@prisma/client"
import { formatISO } from "date-fns"
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
    <section className="px-5 py-3 border border-gray-300 rounded-md shadow mb-4">
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

function downloadFromStr(downloadStr: string) {
  const blob = new Blob([downloadStr], { type: "text/json" })
  const link = document.createElement("a")
  const isoDate = formatISO(new Date(), {
    format: "basic",
  })

  link.download = `BACKUP-${isoDate}.json`
  link.href = URL.createObjectURL(blob)
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":")

  const mouseClickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  })

  link.dispatchEvent(mouseClickEvent)
  link.remove()
}

function ImportExportSection() {
  const router = useRouter()
  const inputFileEl = useRef<HTMLInputElement | null>(null)
  const [inputFile, setInputFile] = useState<File | null>(null)
  const { mutate: exportUserData } = api.transactions.export.useMutation({
    onSuccess: (userData) => {
      downloadFromStr(JSON.stringify(userData, null, 2))
    },
  })

  const { mutate: importUserData } = api.transactions.import.useMutation({
    onSettled: () => {
      if (!inputFileEl.current) return

      setInputFile(null)
      inputFileEl.current.value = ""
    },
    onSuccess: () => {
      router.push("/")
    },
  })

  return (
    <section className="px-5 py-3 border border-gray-300 rounded-md shadow">
      <h3 className="font-semibold mb-1">Import & Export Transactions</h3>
      <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
        <input
          type="file"
          ref={inputFileEl}
          onChange={(e) => {
            if (!e.target.files) {
              setInputFile(null)
              return
            }

            const [file] = Array.from(e.target.files)
            if (!file) {
              setInputFile(null)
              return
            }

            setInputFile(file)
          }}
        />
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 disabled:bg-blue-300 hover:bg-blue-400 transition duration-200 text-white font-medium rounded-md"
          disabled={!inputFile}
          onClick={async () => {
            if (!inputFile) {
              console.log("No file selected")
              return
            }

            const { transactions, transactionImages } = (await new Response(
              inputFile
            ).json()) as {
              transactions: Transaction[]
              transactionImages: TransactionImage[]
            }

            importUserData({
              transactions,
              transactionImages,
            })
          }}
        >
          Import
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition duration-200 text-white font-medium rounded-md"
          onClick={() => {
            exportUserData()
          }}
        >
          Export
        </button>
      </div>
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
        <ImportExportSection />
      </main>
    </div>
  )
}

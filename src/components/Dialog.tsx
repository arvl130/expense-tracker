export function DeleteDialog({
  closeFn,
  actionFn,
}: {
  closeFn: () => void
  actionFn: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-[min(100%,_28rem)] m-auto px-6 py-4 rounded-md">
        <div className="pt-3 pb-6">
          Are you sure you want to delete this transaction?
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-zinc-50 transition duration-200 font-medium"
            onClick={closeFn}
          >
            Cancel
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-200 font-medium"
            onClick={actionFn}
          >
            Yes, delete it.
          </button>
        </div>
      </div>
    </div>
  )
}

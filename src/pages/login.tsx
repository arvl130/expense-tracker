import Loading from "@/components/Loading"
import { signIn } from "next-auth/react"
import { useRedirectOnAuthenticated } from "@/hooks/useRedirect"

export default function Home() {
  const { status } = useRedirectOnAuthenticated()
  if (status !== "unauthenticated") return <Loading />

  return (
    <main className="max-w-6xl mx-auto h-full flex justify-center items-center">
      <div className="text-center">
        <p>
          You must{" "}
          <button
            type="button"
            className="font-medium text-blue-500 hover:underline"
            onClick={() => {
              signIn("google")
            }}
          >
            login
          </button>{" "}
          to use this service.
        </p>
      </div>
    </main>
  )
}

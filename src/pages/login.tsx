import Loading from "@/components/Loading"
import { useRedirectOnAuthenticated } from "@/hooks/useRedirect"
import { api } from "@/utils/api"

export default function Home() {
  const { status } = useRedirectOnAuthenticated()
  if (status !== "unauthenticated") return <Loading />

  return <main className="max-w-6xl mx-auto">This is the login page.</main>
}

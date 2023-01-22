import { stat } from "fs"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

export function useRedirectOnUnauthenticated() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  return {
    session,
    status,
  }
}

export function useRedirectOnAuthenticated() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") router.push("/")
  }, [status, router])

  return {
    session,
    status,
  }
}

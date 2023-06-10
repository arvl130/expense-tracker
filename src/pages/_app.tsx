import "@/styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { api } from "@/utils/api"
import { SessionProvider, signIn, signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import { Inter } from "@next/font/google"
import { Decimal } from "decimal.js"
import SuperJSON from "superjson"

SuperJSON.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  "decimal.js"
)

const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-inter",
})

function Navbar() {
  const { status } = useSession()
  if (status === "loading") return <nav></nav>

  return (
    <nav className="bg-purple-600 text-white shadow-md">
      <div className="h-16 max-w-6xl mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <div>
          {status === "authenticated" ? (
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-white hover:bg-zinc-100 transition duration-200 text-zinc-800 font-medium"
              onClick={() => {
                signOut()
              }}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-white hover:bg-zinc-100 transition duration-200 text-zinc-800 font-medium"
              onClick={() => {
                signIn("google")
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  const { status } = useSession()
  if (status !== "authenticated") return null

  return (
    <footer className="text-center px-4 py-3 font-medium bg-violet-200 text-zinc-500">
      Angelo Geulin &copy; 2023
    </footer>
  )
}

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={`${inter.variable} font-sans`}>
        <Head>
          <title>Expense Tracker</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Track your expenses" />
        </Head>
        <div className="min-h-screen text-zinc-700 grid grid-rows-[auto_1fr]">
          <Navbar />
          <div>
            <Component {...pageProps} />
          </div>
        </div>
        <Footer />
      </div>
    </SessionProvider>
  )
}

export default api.withTRPC(App)

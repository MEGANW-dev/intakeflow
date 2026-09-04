import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          IntakeFlow
        </h1>
        <p className="text-zinc-400 text-lg">
          Automating workflows step by step.
        </p>
        <div>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 font-semibold px-8 py-6 text-md rounded-xl shadow-lg shadow-emerald-900/20 transition-all">
            Day 1 Shipped
          </Button>
        </div>
      </div>
    </main>
  )
}

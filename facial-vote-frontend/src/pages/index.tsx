import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full items-center justify-between text-sm">
       
        <section className="bg-red-900 flex flex-row flex-wrap m-2 p-2">

        <Link href="/register_face" className="p-4"> Register Face</Link>
        <Link href="/register_face"> Vote Now</Link>
        <Link href="/register_face"> Live Result</Link>

        </section>
      </div>
    </main>
  )
}

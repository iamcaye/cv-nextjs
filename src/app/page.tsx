import NavBar from "@/components/nav-bar";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center p-5 md:p-24">
        <section>
          <h1 className="text-center">Hi i'm Cayetano</h1>
          <h1 className="text-orange-400 text-center text-balanced">Software Developer & Electronic Systems Engineer</h1>
        </section>
        <section className="pt-10">
          <p>Currently interested in <b>Web Development</b> and getting started with <b>Artificial Intelligence</b>.</p>
        </section>
      </main>
    </>
  )
}

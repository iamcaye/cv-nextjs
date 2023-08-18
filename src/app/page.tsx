'use client'
import CardComponent from "@/components/card-component";
import NavBar from "@/components/nav-bar";
import TDInfo from "@/pages/td-info";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center p-5 md:p-24">
        <section>
					<h1 className="text-center">Hi I&apos;m Cayetano</h1>
          <h1 className="text-orange-400 text-center text-balanced">Software Developer & Electronic Systems Engineer</h1>
        </section>
        <section className="pt-10">
          <p>Currently interested in <b>Web Development</b> and getting started with <b>Artificial Intelligence</b>.</p>
        </section>

        <section className="pt-10 md:w-8/12 w-11/12">
          <CardComponent title="Work Experience" languages={['python', 'typescript', 'nodejs', "c-sharp-logo", "angularjs"]} 
            moreInfoComponent={<TDInfo/>}>
            <div className="flex-col flex lg:flex-row items-center lg:items-top justify-between">
              <section className="ml-2">
                <p className="text-center md:text-left lg:text-left text-balanced">Working as a <b>Software Developer</b> at <a className="text-red-600 text-bold" rel="noopener" target="_blank" href="https://grupotopdigital.es/">Grupo Topdigital</a>.</p>
                <ul className="ml-5 list-disc">
                  <li>Frontend - Angular</li>
                  <li>Backend - NET Core 6, Express.ts</li>
                  <li>Automation Scripting & Web Scraping - Selenium, HTML Agility Pack</li>
                </ul>
              </section>
              <img className="md:w-6/12 pt-3 w-8/12 sm:w-6/12 lg:w-4/12 lg:pt-0" src="https://grupotopdigital.es/wp-content/uploads/2021/07/logoH-2.png" alt="Grupo Topdgital" />
            </div>
          </CardComponent>
        </section>
      </main>
    </>
  )
}

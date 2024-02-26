'use client'
import CardComponent from "@/components/card-component";
import Footer from "@/components/footer";
import NavBar from "@/components/nav-bar";
import GitProjects from "@/pages/git-projects";
import SkillsComponent from "@/pages/skills";
import TDInfo from "@/pages/td-info";
import WorkExperience from "@/pages/work-experience";

export default function Home() {
  return (
    <div className="flex flex-col justify-center align-middle">
      <NavBar />
      <div className="mt-10 self-center w-11/12 md:w-8/12 xl:w-6/12">
        <main className="w-full">
          <section>
            <h1 className="text-center">Hi I&apos;m Cayetano Biehler</h1>
            <h1 className="text-orange-400 text-center text-balanced">Software Developer & Electronic Systems Engineer</h1>
          </section>
          <section className="pt-10">
            <p className="text-center">Currently interested in <b>Web Development</b> and getting started with <b>Artificial Intelligence</b>.</p>
          </section>

        </main>
        <WorkExperience />
        <SkillsComponent />
        <GitProjects />
        <Footer />
      </div>
    </div>
  )
}

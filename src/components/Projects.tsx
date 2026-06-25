import { projects } from '@/lib/data'
import ProjectCard from './ProjectCard'
import SectionHeader from './SectionHeader'
import MotionSection from './MotionSection'

export default function Projects() {
  return (
    <section
      id="projects"
      className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#e8e6e0] dark:border-[#1a1a1a]"
    >
      <MotionSection>
        <SectionHeader label="01 · Selected Projects" title="Things I've built" />
      </MotionSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <MotionSection key={project.name} delay={i * 0.1}>
            <ProjectCard project={project} />
          </MotionSection>
        ))}
      </div>
    </section>
  )
}

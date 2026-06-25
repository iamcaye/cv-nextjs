import Image from 'next/image'
import { Project } from '@/lib/data'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  return (
    <div className="flex flex-col bg-white dark:bg-[#161616] border border-[#e8e6e0] dark:border-[#222] rounded-lg overflow-hidden hover:border-[#f97316] dark:hover:border-[#f97316] transition-colors h-full">
      <div className="relative h-48 bg-[#f0efeb] dark:bg-[#1c1c1c] border-b border-[#e8e6e0] dark:border-[#222] shrink-0 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.name} screenshot`}
            fill
            className="object-cover object-top"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#ccc] dark:text-[#2a2a2a] tracking-widest uppercase">
            screenshot
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-base font-bold text-[#111] dark:text-[#fafafa] mb-2">
          {project.name}
        </h3>
        <p className="text-sm text-[#737373] leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] text-[#555] dark:text-[#555] bg-[#f5f5f0] dark:bg-[#1c1c1c] border border-[#e8e6e0] dark:border-[#2a2a2a] px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#f97316] hover:underline"
            >
              Live demo ↗
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              className="text-xs text-[#999] dark:text-[#555] hover:text-[#111] dark:hover:text-[#a3a3a3] transition-colors"
            >
              GitHub
            </a>
          )}
          {project.links.caseStudy && (
            <a
              href={project.links.caseStudy}
              className="text-xs text-[#999] dark:text-[#555] hover:text-[#111] dark:hover:text-[#a3a3a3] transition-colors"
            >
              Case study
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

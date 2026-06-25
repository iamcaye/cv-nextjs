import { experience } from '@/lib/data'
import SectionHeader from './SectionHeader'
import MotionSection from './MotionSection'

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#e8e6e0] dark:border-[#1a1a1a]"
    >
      <MotionSection>
        <SectionHeader label="02 · Experience" title="Where I've worked" />
      </MotionSection>

      <div className="flex flex-col gap-16">
        {experience.map((entry, i) => (
          <MotionSection key={entry.company} delay={i * 0.1}>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-12">
              {/* Meta column */}
              <div className="pt-1">
                <p className="font-mono text-xs text-[#f97316] font-semibold tracking-wide mb-2">
                  {entry.period}
                </p>
                <a
                  href={entry.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#555] dark:text-[#555] border-b border-[#d4d0c8] dark:border-[#333] pb-px hover:text-[#111] dark:hover:text-[#a3a3a3] transition-colors"
                >
                  {entry.company}
                </a>
              </div>

              {/* Content column */}
              <div>
                <h3 className="text-xl font-bold tracking-tight text-[#111] dark:text-[#fafafa] mb-3">
                  {entry.role}
                </h3>
                <p className="text-sm text-[#737373] leading-relaxed mb-5">
                  {entry.description}
                </p>
                <ul className="flex flex-col gap-2.5 mb-5">
                  {entry.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-sm text-[#555] dark:text-[#a3a3a3] leading-relaxed"
                    >
                      <span className="text-[#f97316] mt-px shrink-0 text-xs">→</span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Metrics placeholder — remove when real data available */}
                <div className="border border-dashed border-[#d4d0c8] dark:border-[#2a2a2a] rounded-md px-4 py-3 mb-5">
                  <p className="text-xs text-[#bbb] dark:text-[#444] italic">
                    Space reserved for metrics (e.g. &ldquo;Reduced report generation time by X%&rdquo;)
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#e8e6e0] dark:border-[#1a1a1a]">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] text-[#555] dark:text-[#555] bg-[#f5f5f0] dark:bg-[#1c1c1c] border border-[#e8e6e0] dark:border-[#2a2a2a] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </MotionSection>
        ))}
      </div>
    </section>
  )
}

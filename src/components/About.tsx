import SectionHeader from './SectionHeader'
import MotionSection from './MotionSection'

const facts = [
  { label: 'Location', value: 'Málaga, Spain' },
  { label: 'Focus', value: 'Backend · APIs · Infrastructure' },
  { label: 'Experience', value: '4+ years in production' },
  { label: 'Currently building', value: 'Kreate · Nottes' },
]

export default function About() {
  return (
    <section
      id="about"
      className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#e8e6e0] dark:border-[#1a1a1a]"
    >
      <MotionSection>
        <SectionHeader label="04 · About" title="A bit about me" />
      </MotionSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <MotionSection delay={0.1}>
          <div className="flex flex-col gap-5">
            <p className="text-lg text-[#555] dark:text-[#a3a3a3] leading-relaxed">
              I enjoy taking ownership of features from the initial idea to production.
            </p>
            <p className="text-sm text-[#737373] leading-relaxed">
              Understanding the problem, designing the data model, building the API, implementing
              the interface and deploying the final solution — that&apos;s the kind of work I find
              most satisfying.
            </p>
            <p className="text-sm text-[#737373] leading-relaxed">
              I care about{' '}
              <span className="text-[#555] dark:text-[#a3a3a3] font-medium">
                maintainable code
              </span>
              ,{' '}
              <span className="text-[#555] dark:text-[#a3a3a3] font-medium">
                pragmatic architecture
              </span>{' '}
              and building products that solve real problems.
            </p>
            <p className="text-sm text-[#737373] leading-relaxed">
              When I&apos;m not working on production systems, I build personal projects that let
              me explore new tools and ideas — usually involving a terminal.
            </p>
          </div>
        </MotionSection>

        <MotionSection delay={0.2}>
          <div className="flex flex-col gap-6">
            {facts.map((fact) => (
              <div key={fact.label} className="border-l-2 border-[#f97316] pl-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999] dark:text-[#444] mb-1">
                  {fact.label}
                </p>
                <p className="text-sm text-[#555] dark:text-[#a3a3a3]">{fact.value}</p>
              </div>
            ))}
          </div>
        </MotionSection>
      </div>
    </section>
  )
}

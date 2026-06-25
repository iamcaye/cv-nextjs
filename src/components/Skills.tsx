import { skillGroups } from '@/lib/data'
import SectionHeader from './SectionHeader'
import MotionSection from './MotionSection'
import { Fragment } from 'react'

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#e8e6e0] dark:border-[#1a1a1a]"
    >
      <MotionSection>
        <SectionHeader label="03 · Skills" title="What I work with" />
      </MotionSection>

      <MotionSection delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {skillGroups.map((group, i) => {
            const isLeftColumn = i % 2 === 0
            const isLastRow = i >= skillGroups.length - 2
            return (
              <div
                key={group.label}
                className={[
                  'py-7',
                  isLeftColumn
                    ? 'md:pr-10 md:border-r border-[#e8e6e0] dark:border-[#1a1a1a]'
                    : 'md:pl-10',
                  !isLastRow ? 'border-b border-[#e8e6e0] dark:border-[#1a1a1a]' : '',
                ].join(' ')}
              >
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#999] dark:text-[#444] mb-4">
                  {group.label}
                </p>

                {group.label === 'Additional Experience' ? (
                  <div className="flex flex-wrap gap-x-0 gap-y-1">
                    {group.items.map((item, j) => (
                      <Fragment key={item}>
                        <span className="text-sm text-[#bbb] dark:text-[#444]">{item}</span>
                        {j < group.items.length - 1 && (
                          <span className="text-sm text-[#ddd] dark:text-[#333] mx-2">·</span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className={`text-sm ${
                          group.primary
                            ? 'text-[#111] dark:text-[#fafafa] font-medium'
                            : 'text-[#555] dark:text-[#a3a3a3]'
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </MotionSection>
    </section>
  )
}

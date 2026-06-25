interface Props {
  label: string
  title: string
}

export default function SectionHeader({ label, title }: Props) {
  return (
    <div className="mb-12">
      <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#999] dark:text-[#444]">
        {label}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111] dark:text-[#fafafa]">
        {title}
      </h2>
    </div>
  )
}

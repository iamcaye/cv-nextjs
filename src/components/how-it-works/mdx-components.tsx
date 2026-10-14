import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

const calloutLabels = {
  note: 'Note',
  insight: 'Key idea',
  warning: 'Careful',
} as const

interface CalloutProps {
  type?: keyof typeof calloutLabels
  title?: string
  children: ReactNode
}

function Callout({ type = 'note', title, children }: CalloutProps) {
  const kind = type in calloutLabels ? type : 'note'
  return (
    <aside className="hiw-callout" data-type={kind}>
      <p className="hiw-callout-label">{title ?? calloutLabels[kind]}</p>
      <div className="hiw-callout-body">{children}</div>
    </aside>
  )
}

interface FigureProps {
  src: string
  alt: string
  caption?: string
}

function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="hiw-figure">
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

function Anchor({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) {
  const external = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  )
}

function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="hiw-table" role="region" aria-label="Table" tabIndex={0}>
      <table {...props} />
    </div>
  )
}

function Image({ alt = '', ...props }: ComponentPropsWithoutRef<'img'>) {
  return <img alt={alt} loading="lazy" decoding="async" {...props} />
}

export const mdxComponents: MDXComponents = {
  a: Anchor,
  img: Image,
  table: Table,
  Callout,
  Figure,
}

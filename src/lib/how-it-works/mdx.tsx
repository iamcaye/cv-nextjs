import type { MDXComponents } from 'mdx/types'
import * as runtime from 'react/jsx-runtime'
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code'

// Components chapters may use, plus a few harmless inline HTML elements.
export const ALLOWED_JSX_ELEMENTS = new Set([
  'Callout',
  'Figure',
  'abbr',
  'br',
  'kbd',
  'mark',
  'small',
  'sub',
  'sup',
])

interface MdxNode {
  type: string
  name?: string | null
  value?: string
  attributes?: Array<{ type: string; name?: string; value?: unknown }>
  children?: MdxNode[]
  position?: { start: { line: number; column: number } }
}

interface VFileLike {
  fail(reason: string, place?: unknown): never
}

// Chapters arrive through pull requests written by an external agent, and MDX
// would otherwise execute arbitrary JavaScript at build time (e.g. reading
// process.env). Restrict MDX to Markdown plus allow-listed, literal-only JSX.
function remarkSafeMdx() {
  return (tree: MdxNode, file: VFileLike) => {
    const walk = (node: MdxNode) => {
      switch (node.type) {
        case 'mdxjsEsm':
          file.fail('import/export statements are not allowed in chapters', node)
        case 'mdxFlowExpression':
        case 'mdxTextExpression':
          // {/* comments */} are the only expressions allowed.
          if (/^\s*\/\*(?:(?!\*\/)[\s\S])*\*\/\s*$/.test(node.value ?? '')) break
          file.fail(
            'JavaScript expressions ({...}) are not allowed in chapters; escape literal braces as \\{ and \\}',
            node,
          )
        case 'mdxJsxFlowElement':
        case 'mdxJsxTextElement':
          if (!node.name || !ALLOWED_JSX_ELEMENTS.has(node.name)) {
            file.fail(
              `<${node.name ?? ''}> is not an allowed element; use Markdown or one of: ${Array.from(ALLOWED_JSX_ELEMENTS).join(', ')}`,
              node,
            )
          }
          for (const attribute of node.attributes ?? []) {
            if (attribute.type !== 'mdxJsxAttribute' || (attribute.value !== null && typeof attribute.value !== 'string')) {
              file.fail(
                `attributes on <${node.name}> must be plain strings (e.g. type="note"), not expressions`,
                node,
              )
            }
          }
      }
      node.children?.forEach(walk)
    }
    walk(tree)
  }
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: 'github-light', dark: 'github-dark-dimmed' },
  keepBackground: false,
  defaultLang: { block: 'plaintext', inline: 'plaintext' },
}

// The unified ecosystem is ESM-only. Dynamic imports keep this module loadable
// from both Next.js and the CommonJS validator script run through tsx.
async function loadPipeline() {
  const [mdx, remarkGfm, remarkMath, rehypeSlug, rehypeKatex, rehypePrettyCode] = await Promise.all([
    import('@mdx-js/mdx'),
    import('remark-gfm'),
    import('remark-math'),
    import('rehype-slug'),
    import('rehype-katex'),
    import('rehype-pretty-code'),
  ])
  // @types/react's jsx-runtime typings omit Fragment, which exists at runtime.
  const options = {
    ...runtime,
    remarkPlugins: [remarkGfm.default, remarkMath.default, remarkSafeMdx],
    rehypePlugins: [
      rehypeSlug.default,
      [rehypeKatex.default, { strict: 'ignore', throwOnError: true }],
      [rehypePrettyCode.default, prettyCodeOptions],
    ],
  } as unknown as Parameters<typeof mdx.evaluate>[1]
  return { evaluate: mdx.evaluate, options }
}

let pipeline: ReturnType<typeof loadPipeline> | undefined

export async function renderMdx(source: string, components: MDXComponents) {
  pipeline ??= loadPipeline()
  const { evaluate, options } = await pipeline
  const { default: Content } = await evaluate(source, options)
  return <Content components={components} />
}

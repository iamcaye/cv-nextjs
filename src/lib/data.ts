export interface Project {
  name: string
  description: string
  image?: string
  tags: string[]
  highlights: string[]
  links: {
    demo?: string
    github?: string
    caseStudy?: string
  }
}

export interface ExperienceEntry {
  role: string
  company: string
  companyUrl: string
  period: string
  description: string
  bullets: string[]
  tags: string[]
}

export interface SkillGroup {
  label: string
  items: string[]
  primary: boolean
}

export const projects: Project[] = [
  {
    name: 'Kreate',
    description:
      'A platform that helps junior developers gain real-world experience by completing structured software projects.',
    image: '/kreate.webp',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Clerk'],
    highlights: [
      'Project catalogue and user profiles',
      'Submission and feedback workflows',
      'Authentication and role-based access',
      'Production deployment and analytics',
    ],
    links: {
      // Fill in real URLs when available
      demo: 'https://kreate.es?utm_source=cv&utm_medium=portfolio&utm_campaign=projects',
    },
  },
  {
    name: 'Nottes',
    description: 'A local-first note-taking application with CLI and TUI interfaces.',
    tags: ['Rust', 'SQLite', 'Ratatui', 'Clap'],
    highlights: [
      'Tag-based note organization',
      'Interactive terminal interface',
      'CLI subcommands',
      'Local persistence',
    ],
    links: {
      // Fill in real URLs when available
    },
  },
]

export const experience: ExperienceEntry[] = [
  {
    role: 'Software Developer',
    company: 'Grupo Topdigital',
    companyUrl: 'https://grupotopdigital.es/',
    period: '2022 — Present',
    description:
      'Developing and maintaining a business-critical sales platform, working independently across frontend, backend and infrastructure.',
    bullets: [
      'Built end-to-end features using Angular, TypeScript, Express and .NET',
      'Designed APIs, database models and asynchronous processes',
      'Automated internal workflows and data extraction processes',
      'Investigated production issues and improved application reliability',
      'Collaborated directly with stakeholders to turn business requirements into technical solutions',
    ],
    tags: ['Angular', 'TypeScript', 'Express', '.NET', 'MariaDB', 'Docker'],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    label: 'Core',
    items: ['TypeScript', 'Node.js', 'Express', 'Angular', 'Next.js'],
    primary: true,
  },
  {
    label: 'Backend & Data',
    items: ['REST APIs', 'PostgreSQL', 'MariaDB', 'Redis', 'tRPC', 'Drizzle'],
    primary: true,
  },
  {
    label: 'Infrastructure',
    items: ['Docker', 'Linux', 'CI/CD', 'Traefik', 'Kubernetes'],
    primary: false,
  },
  {
    label: 'Additional Experience',
    items: ['.NET', 'Python', 'Go', 'Rust', 'Embedded Systems'],
    primary: false,
  },
]

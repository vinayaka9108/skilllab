/**
 * Single source of truth for portfolio content.
 *
 * Honesty rules baked in:
 *  - Anything not verified is `undefined` (hidden) or `verified: false` (filtered out).
 *  - Flip `verified` to true / fill a field ONLY when it is actually true.
 *  - Contact details come from environment variables (see .env.example).
 */

const env = import.meta.env
const clean = (v: unknown): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim() : undefined

export const contact = {
  email: clean(env.VITE_CONTACT_EMAIL),
  github: clean(env.VITE_GITHUB_URL),
  linkedin: clean(env.VITE_LINKEDIN_URL),
  formEndpoint: clean(env.VITE_CONTACT_ENDPOINT),
}

export const profile = {
  fullName: 'Vinayaka Neelammanavara',
  name: 'Vinay',
  college: 'RV College of Engineering',
  city: 'Bengaluru',
  region: 'Karnataka, India',
  stage: 'Third semester',
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export type SkillCategoryId = 'programming' | 'web' | 'security' | 'tools'

/**
 * Proficiency is never invented.
 *  - 'Fundamentals'  → beginner-level; marked as such on the tile.
 *  - 'Working'       → backed by lab work / shipped project files.
 *  - omitted         → no level is claimed at all.
 */
export type SkillLevel = 'Fundamentals' | 'Working'

export interface Skill {
  id: string
  symbol: string
  name: string
  category: SkillCategoryId
  /** Only set when the brief or the evidence supports it. */
  level?: SkillLevel
  about: string
  /** Concrete, true example of use. Leave undefined until you can state one. */
  usage?: string
  /** false → hidden from the site until confirmed by project files / you. */
  verified: boolean
}

export const skillCategories: { id: SkillCategoryId; label: string; blurb: string }[] = [
  { id: 'programming', label: 'Programming', blurb: 'Languages' },
  { id: 'web', label: 'Web Development', blurb: 'Front-end foundations' },
  { id: 'security', label: 'Security & Systems', blurb: 'How systems stay safe and work' },
  { id: 'tools', label: 'Tools & Technologies', blurb: 'What I build with' },
]

export const skills: Skill[] = [
  {
    id: 'c',
    symbol: 'C',
    name: 'C Programming',
    category: 'programming',
    level: 'Working',
    about:
      'A low-level language that teaches memory, pointers, processes and how programs really run on hardware.',
    usage:
      '19 lab programs written in C — expression trees, hashing, binary search trees, threads, semaphores and the classic synchronisation problems.',
    verified: true,
  },
  {
    id: 'java',
    symbol: 'Jv',
    name: 'Java',
    category: 'programming',
    about:
      'A general-purpose, object-oriented language widely used for backend systems and Android development.',
    verified: true,
  },
  {
    id: 'python',
    symbol: 'Py',
    name: 'Python',
    category: 'programming',
    level: 'Fundamentals',
    about:
      'A readable, versatile language used for scripting, automation, data work and rapid prototyping.',
    verified: true,
  },
  {
    id: 'html',
    symbol: 'Ht',
    name: 'HTML',
    category: 'web',
    level: 'Working',
    about: 'The semantic structure of the web: headings, landmarks, forms and accessible markup.',
    usage:
      'Semantic structure and accessible markup underpin every section of this portfolio — and a set of focused HTML drills covering tags, forms and semantics.',
    verified: true,
  },
  {
    id: 'css',
    symbol: 'Cs',
    name: 'CSS',
    category: 'web',
    level: 'Working',
    about: 'Layout, typography, responsive design and motion for the browser.',
    usage:
      'Responsive layouts, glass surfaces and reduced-motion handling on this site, plus drills on specificity, the box model, flexbox, grid and breakpoints.',
    verified: true,
  },
  {
    id: 'js',
    symbol: 'Js',
    name: 'JavaScript',
    category: 'web',
    level: 'Working',
    about: 'The language of the browser — interactivity, state and asynchronous behaviour.',
    usage: 'Powers every interaction on this site, written in TypeScript for safety.',
    verified: true,
  },
  {
    id: 'react',
    symbol: 'Re',
    name: 'React',
    category: 'web',
    level: 'Working',
    about: 'A component-based library for building user interfaces.',
    usage: 'This portfolio is a React application — sections, 3D scenes and the contact form are all components.',
    verified: true,
  },
  {
    id: 'typescript',
    symbol: 'Ts',
    name: 'TypeScript',
    category: 'web',
    level: 'Working',
    about: 'JavaScript with a type system — safer refactors and clearer interfaces.',
    usage: 'The entire source of this portfolio is typed, from the 3D scene props to the content config.',
    verified: true,
  },
  {
    id: 'cyber',
    symbol: 'Cy',
    name: 'Cybersecurity',
    category: 'security',
    level: 'Fundamentals',
    about:
      'Core ideas of protecting systems and data: confidentiality, integrity, availability and access control.',
    usage: 'Explored through Vaultix, a project on secure cloud storage with role-based access.',
    verified: true,
  },
  {
    id: 'crypto',
    symbol: 'En',
    name: 'Encryption Concepts',
    category: 'security',
    level: 'Fundamentals',
    about:
      'How symmetric and asymmetric encryption and hashing protect data at rest and in transit.',
    usage: 'Studied in the context of Vaultix, which explores encrypted cloud file storage.',
    verified: true,
  },
  {
    id: 'blockchain',
    symbol: 'Bc',
    name: 'Blockchain',
    category: 'security',
    level: 'Fundamentals',
    about:
      'Distributed, tamper-evident ledgers — how blocks, hashes and consensus keep records trustworthy.',
    usage: 'Vaultix explores a blockchain ledger for integrity and audit records.',
    verified: true,
  },
  {
    id: 'os',
    symbol: 'Os',
    name: 'Operating Systems',
    category: 'security',
    level: 'Working',
    about: 'Processes, memory, scheduling and file systems — what sits between programs and hardware.',
    usage:
      'OS lab in C: UNIX-style ls/cp/mv, binary search, pthreads, and the reader–writer, producer–consumer and dining-philosophers problems.',
    verified: true,
  },
  {
    id: 'dsa',
    symbol: 'Ds',
    name: 'Data Structures & Algorithms',
    category: 'security',
    level: 'Working',
    about:
      'Organising data and designing efficient procedures — the foundation of problem-solving in software.',
    usage:
      'DSA lab in C: infix-to-postfix conversion, prefix evaluation, circular queues, polynomial multiplication, hashing, priority queues, expression trees, binary trees and BSTs.',
    verified: true,
  },
  {
    id: 'three',
    symbol: 'R3',
    name: 'Three.js & React Three Fiber',
    category: 'tools',
    level: 'Working',
    about: 'WebGL 3D graphics for the browser, with a React renderer.',
    usage: 'Used to build the interactive 3D scenes on this very portfolio.',
    verified: true,
  },
  {
    id: 'build',
    symbol: 'Vt',
    name: 'Vite & Tailwind CSS',
    category: 'tools',
    level: 'Working',
    about: 'A fast dev server and build tool, with a utility-first styling system.',
    usage: 'This portfolio is built on Vite with Tailwind CSS v4, and is type-checked on every build.',
    verified: true,
  },
  {
    id: 'git',
    symbol: 'Gt',
    name: 'Git & GitHub',
    category: 'tools',
    about: 'Version control and collaboration for tracking changes and sharing code.',
    // Hidden until you confirm you use Git day to day — then flip this to true.
    verified: false,
  },
  {
    id: 'node',
    symbol: 'Nx',
    name: 'Node.js & Express',
    category: 'tools',
    about: 'A JavaScript runtime and minimal web framework for building backend services.',
    verified: false,
  },
  {
    id: 'sqlite',
    symbol: 'Sq',
    name: 'SQLite',
    category: 'tools',
    about: 'A lightweight, file-based relational database.',
    verified: false,
  },
]

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectId = 'vaultix' | 'gapbridge' | 'dcet'

export interface Project {
  id: ProjectId
  name: string
  title: string
  category: string
  /** concept | prototype | deployed | academic | tool — only when the evidence supports it. */
  status?: { label: string; kind: 'academic' | 'concept' | 'prototype' | 'deployed' | 'tool' }
  description: string
  problem: string
  solution: string
  features: string[]
  /** Technology actually used. Leave empty until verified from the source. */
  stack: string[]
  /** Your individual contribution. Leave undefined until you write it. */
  contribution?: string
  /** Real links only. Buttons are hidden when undefined. */
  links: { demo?: string; source?: string }
  /** Algorithms shown only once verified in the implementation. */
  verifiedAlgorithms: string[]
}

export const projects: Project[] = [
  {
    id: 'vaultix',
    name: 'Vaultix',
    title: 'Blockchain-Based Security for Cloud Data Storage',
    category: 'Security · Cloud · Blockchain',
    status: { label: 'Academic project', kind: 'academic' },
    description:
      'An academic project exploring secure cloud file storage, role-based access control, encryption, and blockchain-based audit records.',
    problem:
      'Files stored in the cloud raise two questions: who is allowed to read them, and can the record of who touched them be trusted?',
    solution:
      'Vaultix explores combining role-based access, encrypted storage and an immutable blockchain ledger so that every file has a verifiable integrity and audit trail.',
    features: [
      'Data owner and data user roles',
      'Trusted authority and organization-based access',
      'Cloud storage for files',
      'Blockchain ledger for integrity and audit records',
    ],
    stack: [], // e.g. ['Node.js', 'Express', 'SQLite'] — add once verified from the source
    contribution: undefined,
    links: { demo: undefined, source: undefined },
    // e.g. ['AES-256-GCM', 'RSA-2048', 'SHA-256'] — add ONLY after confirming in the code
    verifiedAlgorithms: [],
  },
  {
    id: 'gapbridge',
    name: 'GapBridge',
    title: 'Bridging Academic Gaps for Students',
    category: 'EdTech · Student guidance',
    status: { label: 'Concept', kind: 'concept' },
    description:
      'A student-focused concept designed to help lateral-entry students identify academic gaps, access learning resources, and connect with experienced student mentors.',
    problem:
      'Lateral-entry students join engineering in the second year and may be missing fundamentals that regular-entry students already covered.',
    solution:
      'GapBridge imagines a single place to spot those gaps, find the right learning resources, and meet student mentors who have been through the same transition.',
    features: [
      'Academic gap identification',
      'Learning resources',
      'Peer mentoring',
      'Student guidance and discovery',
    ],
    stack: [],
    contribution: undefined,
    links: { demo: undefined, source: undefined },
    verifiedAlgorithms: [],
  },
  {
    id: 'dcet',
    name: 'DCET Rank Predictor',
    title: 'DCET Rank Prediction Tool',
    category: 'Tool · Admissions',
    status: { label: 'Tool', kind: 'tool' },
    description:
      'A tool designed to help diploma students explore possible DCET rank outcomes and make more informed engineering-college admission decisions.',
    problem:
      'Diploma students preparing for lateral entry often have little context for what their DCET performance might translate to.',
    solution:
      'The tool lets students explore possible rank outcomes so they can reason about college options with more information.',
    // The source is not in the portfolio folder, so inputs, validation, prediction
    // method and deployment status are deliberately NOT described here yet.
    features: [],
    stack: [],
    contribution: undefined,
    links: { demo: undefined, source: undefined },
    verifiedAlgorithms: [],
  },
]

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export interface Milestone {
  id: string
  short: string
  title: string
  detail: string
  /** 0–100, only for real, supplied percentages. */
  percent?: number
  figure: string
  figureLabel: string
  current?: boolean
  note?: string
  /** Subjects currently being studied — only listed when the syllabus is known. */
  courses?: string[]
}

export const milestones: Milestone[] = [
  {
    id: 'sslc',
    short: 'SSLC',
    title: 'SSLC',
    detail: 'Secondary School Leaving Certificate',
    percent: 95,
    figure: '95%',
    figureLabel: 'Score',
  },
  {
    id: 'puc',
    short: 'PUC',
    title: 'PUC — Science',
    detail: 'Pre-University Course, Science stream',
    percent: 71,
    figure: '71%',
    figureLabel: 'Score',
  },
  {
    id: 'diploma',
    short: 'Diploma',
    title: 'Diploma in Computer Science & Engineering',
    detail: 'Three-year diploma programme',
    percent: 89.7,
    figure: '9.72',
    figureLabel: 'Diploma CGPA · 89.7%',
    note: 'This is the diploma CGPA, separate from my current B.E. programme.',
  },
  {
    id: 'be',
    short: 'B.E.',
    title: 'B.E. in Computer Science & Engineering',
    detail: 'RV College of Engineering, Bengaluru',
    figure: 'Sem 3',
    figureLabel: 'Currently in progress',
    current: true,
    note: 'B.E. results will be added as they are earned.',
    courses: [
      'Data Structures & Algorithms',
      'Operating Systems',
      'Analog & Digital Logic Design',
      'Engineering Mathematics III',
    ],
  },
]

/**
 * Grounded in what is actually in the reference folder: a Design Thinking Lab
 * report + presentation, written lab records with solution write-ups, and
 * team-built academic projects. Nothing here claims employment or awards.
 */
export const beyondTheCode = [
  {
    title: 'Team coordination',
    text: 'Splitting an academic project into clear parts so a team can work in parallel — Vaultix was built as a group effort with roles split by concern.',
  },
  {
    title: 'Project documentation',
    text: 'Writing it down as I go: a lab record and solution write-up for every lab program, and a full report with slides for the Design Thinking Lab project.',
  },
  {
    title: 'Academic collaboration',
    text: 'Learning alongside classmates — comparing approaches, reviewing each other’s work and sharing what actually worked.',
  },
  {
    title: 'Communication & problem-solving',
    text: 'Explaining a technical idea plainly, then working the problem down one step at a time until it runs.',
  },
  {
    title: 'Learning by implementing',
    text: 'Turning concepts from class into working programs — 19 lab programs in C so far, because building is what makes it stick.',
  },
]

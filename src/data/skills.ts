export interface SkillItem {
  name: string;
  category: string;
  description: string;
  tags: string[];
}

export interface SkillCategory {
  id: string;
  code: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    code: "A",
    title: "PROGRAMMING LANGUAGES",
    description: "Core languages used for building client and server-side software systems.",
    skills: [
      { name: "TypeScript", category: "Languages", description: "Strongly typed JavaScript for robust application development.", tags: ["Typed", "ESNext", "Generics"] },
      { name: "JavaScript", category: "Languages", description: "Modern ES6+ asynchronous web software development.", tags: ["Async/Await", "DOM", "V8 Engine"] },
      { name: "Python", category: "Languages", description: "Backend APIs, automation scripts, and data manipulation.", tags: ["Automation", "FastAPI", "Data"] },
      { name: "SQL", category: "Languages", description: "Declarative database querying, schema design, and optimizations.", tags: ["Queries", "Joins", "Indexing"] },
      { name: "HTML5 / CSS3", category: "Languages", description: "Semantic markups, responsive layouts, and accessibility.", tags: ["Semantic", "Flexbox/Grid", "ARIA"] }
    ]
  },
  {
    id: "frontend",
    code: "B",
    title: "FRONTEND ENGINEERING",
    description: "Frameworks, UI libraries, and browser APIs for modern web experiences.",
    skills: [
      { name: "React", category: "Frontend", description: "Component-driven architecture, custom hooks, and state management.", tags: ["Hooks", "Virtual DOM", "JSX"] },
      { name: "Vite", category: "Frontend", description: "Lightning-fast frontend build tooling and HMR configuration.", tags: ["Bundler", "ESM", "Fast Build"] },
      { name: "Tailwind CSS", category: "Frontend", description: "Utility-first CSS styling for responsive, consistent UI design.", tags: ["Design Systems", "v4", "Flex/Grid"] },
      { name: "Three.js / WebGL", category: "Frontend", description: "3D scene composition, custom shaders, lights, and camera controls.", tags: ["3D Viewport", "PBR Materials", "Shaders"] },
      { name: "Next.js", category: "Frontend", description: "Full-stack React framework for SSR, SSG, and API routing.", tags: ["SSR", "App Router", "Optimization"] },
      { name: "State Management", category: "Frontend", description: "Predictable application state synchronization (Zustand / Context API).", tags: ["Zustand", "Context", "Redux"] }
    ]
  },
  {
    id: "backend",
    code: "C",
    title: "BACKEND ENGINEERING",
    description: "Server architectures, API gateways, microservices, and network protocols.",
    skills: [
      { name: "Node.js", category: "Backend", description: "Event-driven, non-blocking asynchronous server runtime environment.", tags: ["V8", "Event Loop", "Async Stream"] },
      { name: "Express.js", category: "Backend", description: "Minimalist server framework for RESTful routing and middleware.", tags: ["REST APIs", "Middleware", "Routing"] },
      { name: "RESTful APIs", category: "Backend", description: "Structured endpoint design, HTTP protocols, and JSON serialization.", tags: ["JSON", "CRUD", "HTTP Specs"] },
      { name: "Authentication & Security", category: "Backend", description: "JWT tokens, password hashing, CORS, and role-based access control.", tags: ["JWT", "RBAC", "Sanitization"] },
      { name: "WebSockets", category: "Backend", description: "Real-time bidirectional event streaming and client messaging.", tags: ["Real-time", "Sockets", "Events"] }
    ]
  },
  {
    id: "databases",
    code: "D",
    title: "DATABASES AND DATA MANAGEMENT",
    description: "Relational, document, and in-memory storage solutions for data persistence.",
    skills: [
      { name: "PostgreSQL", category: "Databases", description: "Enterprise relational database system with ACID compliance.", tags: ["Relational", "ACID", "Transactions"] },
      { name: "MongoDB", category: "Databases", description: "Document-oriented NoSQL database for flexible data structures.", tags: ["NoSQL", "BSON", "Aggregation"] },
      { name: "Firebase Firestore", category: "Databases", description: "Real-time cloud database with security rules and live listeners.", tags: ["Cloud DB", "Real-time", "Security Rules"] },
      { name: "Redis", category: "Databases", description: "In-memory key-value data store for high-performance caching.", tags: ["Cache", "In-Memory", "Pub/Sub"] },
      { name: "Prisma / Drizzle ORM", category: "Databases", description: "Type-safe database ORM and query building abstraction.", tags: ["Type-Safe", "Migrations", "Queries"] }
    ]
  },
  {
    id: "tools",
    code: "E",
    title: "DEVELOPMENT TOOLS AND INFRASTRUCTURE",
    description: "Version control, containerization, build tools, and deployment environments.",
    skills: [
      { name: "Git & GitHub", category: "Tools", description: "Version control, branching strategies, code reviews, and PR flows.", tags: ["Version Control", "Rebase", "PRs"] },
      { name: "Docker", category: "Tools", description: "Containerized application packaging and environment isolation.", tags: ["Containers", "Dockerfile", "Compose"] },
      { name: "Linux / Bash", category: "Tools", description: "Command line administration, shell scripting, and server setup.", tags: ["Shell", "POSIX", "Scripting"] },
      { name: "Vercel / Cloud Hosting", category: "Tools", description: "Serverless deployments, environment configurations, and domain management.", tags: ["Deployment", "CI/CD", "Edge"] }
    ]
  },
  {
    id: "fundamentals",
    code: "F",
    title: "COMPUTER SCIENCE FUNDAMENTALS",
    description: "Foundational software engineering principles for building efficient systems.",
    skills: [
      { name: "Data Structures & Algorithms", category: "CS Fundamentals", description: "Arrays, trees, graphs, dynamic programming, and space/time complexity.", tags: ["Big-O", "Algorithms", "Optimization"] },
      { name: "System Design", category: "CS Fundamentals", description: "Scalable architecture pattern design, caching, load balancing, and rate limiting.", tags: ["Scalability", "Architecture", "Microservices"] },
      { name: "Object-Oriented Programming", category: "CS Fundamentals", description: "Encapsulation, inheritance, polymorphism, and abstraction principles.", tags: ["OOP", "Design Patterns", "SOLID"] },
      { name: "Performance Engineering", category: "CS Fundamentals", description: "Bundle optimization, memory leak prevention, DOM rendering speed, and WebGL pacing.", tags: ["Profiling", "Memory", "FPS"] }
    ]
  }
];

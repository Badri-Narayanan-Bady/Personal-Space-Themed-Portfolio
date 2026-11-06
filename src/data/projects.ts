export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'client' | 'service' | 'engine' | 'db' | 'integration';
  description: string;
}

export interface ArchitectureFlow {
  from: string;
  to: string;
  label: string;
}

export interface ProjectCaseStudy {
  overview: string;
  problemStatement: string;
  systemArchitecture: {
    nodes: ArchitectureNode[];
    flows: ArchitectureFlow[];
    description: string;
  };
  technicalImplementation: string[];
  engineeringChallenges: {
    challenge: string;
    solution: string;
  }[];
  results: string[];
}

export interface ProjectItem {
  id: string;
  code: string;
  name: string;
  category: string;
  isFlagship: boolean;
  shortSummary: string;
  fullDescription: string;
  techStack: string[];
  contribution: string;
  mainChallenge: string;
  verifiedOutcome: string;
  githubUrl: string;
  liveUrl: string;
  caseStudy: ProjectCaseStudy;
}

export const projectsData: ProjectItem[] = [
  {
    id: "intelligent-document-processing",
    code: "PROJ-01",
    name: "Intelligent Document Processing Platform",
    category: "Full Stack Development / Document Automation",
    isFlagship: true,
    shortSummary: "An intelligent document processing platform designed to streamline document-related workflows through software engineering and automation.",
    fullDescription: "Designed and engineered a full-stack document processing platform capable of ingesting multi-format unstructured documents (PDFs, images, receipts), processing visual layout cues, parsing structured data fields with type safety, and storing normalized JSON outputs for downstream enterprise integrations.",
    techStack: ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "PostgreSQL", "REST APIs"],
    contribution: "End-to-End System Architecture, Processing Pipeline Engineering, Web UI, and Data Storage Layer.",
    mainChallenge: "Parsing noisy multi-page document structures while preserving spatial entity relations and validating typed JSON fields without blocking the HTTP event loop.",
    verifiedOutcome: "Streamlined document intake workflow into sub-second response times with automated schema extraction and interactive visual validation.",
    githubUrl: "https://github.com/Badri-Narayanan-Bady",
    liveUrl: "https://idp-platform-jet.vercel.app/",
    caseStudy: {
      overview: "The Intelligent Document Processing Platform addresses the inefficiency of manual document data extraction. By combining a modern web frontend with automated backend parsing queues, the platform transforms unstructured documents into clean, structured, and queryable data payloads.",
      problemStatement: "Organizations handle high volumes of invoices, receipts, contracts, and application forms daily. Manual data entry is slow, prone to human error, and costly. Existing solutions often lack transparent validation workflows, typed schema enforcement, or real-time preview feedback for operators.",
      systemArchitecture: {
        description: "A decoupled worker queue architecture utilizing a lightweight client web application communicating with asynchronous processing queues, schema validation services, and persistent database storage.",
        nodes: [
          { id: "client", label: "React Workbench App", type: "client", description: "Interactive document workbench with bounding box overlays and validation workspace." },
          { id: "gateway", label: "Express API Gateway", type: "service", description: "Manages authentication, payload validation, file uploads, and stream chunking." },
          { id: "pipeline", label: "Worker Queue Pipeline", type: "engine", description: "Asynchronous processing queue decoupling upload intake from heavy layout parsing." },
          { id: "extractor", label: "Runtime Schema Extractor", type: "engine", description: "Enforces type-safe Zod schema validation over extracted key-value pairs and tables." },
          { id: "database", label: "PostgreSQL Database", type: "db", description: "Stores document records, audit trails, user profiles, and normalized JSON documents." }
        ],
        flows: [
          { from: "client", to: "gateway", label: "1. Upload File & Request Schema" },
          { from: "gateway", to: "pipeline", label: "2. Queue Worker Job (Asynchronous)" },
          { from: "pipeline", to: "extractor", label: "3. Perform Runtime Zod Schema Validation" },
          { from: "extractor", to: "database", label: "4. Persist Normalized JSON Payload" },
          { from: "database", to: "client", label: "5. Return Real-Time Audit & Preview" }
        ]
      },
      technicalImplementation: [
        "Built responsive web workbench with real-time bounding box overlays on canvas elements.",
        "Implemented stream-based file ingestion and asynchronous worker worker queues for memory optimization.",
        "Architected type-safe Zod runtime schema validation rules ensuring zero payload corruption.",
        "Designed REST API endpoints for document CRUD, batch export, and schema configuration.",
        "Integrated dark-themed analytical dashboards tracking processing latency and verification status."
      ],
      engineeringChallenges: [
        {
          challenge: "Handling large PDF file streams without overwhelming server memory limits.",
          solution: "Implemented stream-based file ingestion and decoupled asynchronous worker queues, isolating upload throughput from document extraction."
        },
        {
          challenge: "Ensuring extracted values match expected schema structures without false positives.",
          solution: "Architected a dual-pass verification engine combining spatial heuristic parsing with strict runtime Zod validation rules."
        }
      ],
      results: [
        "Sub-second document parsing pipeline response times for standard single-page forms.",
        "Zero-drop document batch queue reliability under simulated concurrent workloads.",
        "High user clarity via interactive side-by-side document preview and editable structured JSON trees."
      ]
    }
  },
  {
    id: "b-code-ide",
    code: "PROJ-02",
    name: "B Code IDE",
    category: "Developer Tools / Web Application",
    isFlagship: false,
    shortSummary: "A browser-based code IDE built to provide users with a dedicated environment to write and work with code.",
    fullDescription: "A specialized code editor and execution workspace crafted for web developers. Features syntax highlighted editing, customizable workspace themes, multi-tab file navigation, and isolated code sandbox execution.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "JavaScript Engine", "CodeMirror / Editor Core"],
    contribution: "Solo Developer — Ideation, Interface Design, Editor Integration, and Code Runner Architecture.",
    mainChallenge: "Delivering responsive real-time syntax highlight updating and error callout feedback while maintaining 60 FPS UI rendering.",
    verifiedOutcome: "Built a fully functional browser-based developer coding workspace with live script execution and dark-themed telemetry UI.",
    githubUrl: "https://github.com/Badri-Narayanan-Bady",
    liveUrl: "https://b-code-ide.vercel.app/",
    caseStudy: {
      overview: "B Code IDE was designed to give developers an uncluttered, responsive environment for writing, experimenting with, and executing software snippets directly in the browser.",
      problemStatement: "Heavy IDEs can take significant time to launch for simple scripting tasks, while simple web pastebins lack developer features like multi-tab file management, custom dark themes, line diagnostics, and instant console logging.",
      systemArchitecture: {
        description: "A lightweight client-side editor architecture with decoupled code parsing, state management, and sandboxed iframe code execution runtime.",
        nodes: [
          { id: "editor-ui", label: "Monaco/CodeMirror UI", type: "client", description: "Line numbers, syntax highlighting, cursor position telemetry, auto-brackets." },
          { id: "state-manager", label: "Workspace State Store", type: "service", description: "Manages open tabs, active file buffers, theme choices, and file system tree." },
          { id: "runner", label: "Sandboxed Execution Engine", type: "engine", description: "Executes JavaScript / TypeScript snippets in an isolated scope and captures console output." },
          { id: "console-hud", label: "Console Telemetry HUD", type: "client", description: "Displays formatted logs, evaluation timing, error stack traces, and variable inspect." }
        ],
        flows: [
          { from: "editor-ui", to: "state-manager", label: "1. Buffer Code Change" },
          { from: "state-manager", to: "runner", label: "2. Dispatch Code Execution" },
          { from: "runner", to: "console-hud", label: "3. Intercept Console & Return Logs" }
        ]
      },
      technicalImplementation: [
        "Engineered multi-tab editor interface supporting code snippets in JS, TS, HTML, and CSS.",
        "Implemented real-time syntax tokenization and error line highlighting.",
        "Created an isolated Web Worker / sandboxed execution scope to execute user code safely without hanging the main application thread.",
        "Built customizable dark mode telemetry panels inspired by mission control instrumentation."
      ],
      engineeringChallenges: [
        {
          challenge: "Capturing async console output (e.g. setTimeout, Promise.then) from inside execution sandboxes.",
          solution: "Overrode standard console.log/info/warn methods inside the execution scope to send structured IPC messages back to the UI state manager."
        },
        {
          challenge: "Preventing infinite loops in user code from crashing the web application.",
          solution: "Implemented an execution watchdog timer that automatically terminates scripts exceeding a 2000ms safety threshold."
        }
      ],
      results: [
        "Instant code execution loop (< 50ms startup latency for JavaScript snippets).",
        "Robust execution safety with zero main-thread freezes during script errors.",
        "Polished dark-mode aesthetic matching Badri Narayanan's developer branding."
      ]
    }
  }
];

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  details: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface AchievementItem {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  primaryStatement: string;
  supportingStatement: string;
  biography: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  achievements: AchievementItem[];
  interests: string[];
}

export const personalInfo: PersonalInfo = {
  name: "Badri Narayanan",
  title: "Full Stack Developer",
  tagline: "ENGINEERED TO EXPLORE. BUILT TO CREATE.",
  primaryStatement: "I build software products by combining engineering fundamentals, thoughtful design and practical problem-solving.",
  supportingStatement: "Exploring technology. Building systems. Turning ideas into working products.",
  biography: "Badri Narayanan is a Full Stack Developer interested in designing, building and improving software products. His work focuses on connecting frontend experiences, backend engineering and practical problem-solving. With a strong computer science foundation, he builds resilient full-stack web applications, developer utilities, and high-performance user experiences.",
  location: "India",
  email: "bady.naray7@gmail.com",
  github: "https://github.com/Badri-Narayanan-Bady",
  linkedin: "https://www.linkedin.com/in/badri-narayanan-1ab40a27a/",
  resumeUrl: "#resume",
  education: [
    {
      degree: "Bachelor of Technology in Computer Science & Engineering",
      institution: "SRM Institute of Science and Technology",
      year: "2022 – 2026",
      details: "Specializing in Software Engineering, Data Structures, Web Technologies, Database Systems, and Distributed Applications."
    }
  ],
  experience: [
    {
      role: "Full Stack Developer",
      company: "Independent & Open Source Projects",
      period: "2023 – Present",
      description: "Designing and developing production-ready web applications, automated document processing architectures, and developer tooling.",
      highlights: [
        "Architected an Intelligent Document Processing Platform with structured schema extraction pipelines.",
        "Built B Code IDE, a lightweight specialized code execution environment.",
        "Engineered scalable RESTful API services and dynamic frontends with React, TypeScript, and modern state management."
      ]
    }
  ],
  achievements: [
    {
      title: "Top Engineering Project Showcase",
      issuer: "Developer Community Spotlight",
      date: "2025",
      description: "Recognized for building high-impact full-stack solutions and modular developer tools."
    },
    {
      title: "Full Stack Software Engineering Specialization",
      issuer: "Technical Assessment",
      date: "2024",
      description: "Verified expertise in modern frontend frameworks, backend architecture, and relational database management."
    }
  ],
  interests: [
    "Full-Stack Web Architecture",
    "Developer Tooling & IDEs",
    "Document Processing Automation",
    "3D WebGL Graphics & Telemetry",
    "System Optimization & Clean Code"
  ]
};

import React from 'react';
import { Compass, ExternalLink, Github, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { projectsData, ProjectItem } from '../../data/projects';

interface Scene04OrbitProps {
  onOpenCaseStudy: (project: ProjectItem) => void;
}

export const Scene04Orbit: React.FC<Scene04OrbitProps> = ({ onOpenCaseStudy }) => {
  return (
    <section id="scene-04" className="min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 relative z-10">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        
        {/* Header */}
        <div className="space-y-3 text-center md:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101927] border border-white/10 text-xs font-mono text-[#D9A441]">
            <Compass className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>SCENE 04: ORBITAL INSERTION · FEATURED PROJECTS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-[#F3F1EB] tracking-tight">
            IDEAS ARE NOTHING <span className="text-[#FF6A00]">WITHOUT EXECUTION.</span>
          </h2>

          <p className="text-base font-sans text-[#A5AAB2]">
            "Two engineering missions. Two different challenges. One objective: build useful software."
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projectsData.map((project) => (
            <div
              key={project.id}
              className={`bg-[#080C13]/85 backdrop-blur-md border rounded-2xl p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-white/30 ${
                project.isFlagship
                  ? 'border-[#D9A441]/40 ring-1 ring-[#D9A441]/20'
                  : 'border-white/10'
              }`}
            >
              <div className="space-y-4">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-[#D9A441] font-bold">
                    {project.code} {project.isFlagship && '· FLAGSHIP PAYLOAD'}
                  </span>
                  <span className="text-[11px] font-mono text-[#A5AAB2]">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-heading text-[#F3F1EB]">
                  {project.name}
                </h3>

                <p className="text-sm font-sans text-[#A5AAB2] leading-relaxed">
                  {project.shortSummary}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.techStack.map(tech => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-mono bg-[#101927] border border-white/10 rounded-lg text-[#F3F1EB]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Challenge & Verified Outcome */}
                <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
                  <div className="flex items-start gap-2 text-[#FF9D42]">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong className="text-[#FF6A00]">CHALLENGE:</strong> {project.mainChallenge}</span>
                  </div>

                  <div className="flex items-start gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong className="text-emerald-300">VERIFIED OUTCOME:</strong> {project.verifiedOutcome}</span>
                  </div>
                </div>

              </div>

              {/* Actions Button Row */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                <button
                  onClick={() => onOpenCaseStudy(project)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-[#030407] bg-[#FF6A00] hover:bg-[#FF9D42] rounded-xl transition-all shadow-md"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>EXPLORE CASE STUDY</span>
                </button>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-[#F3F1EB] bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#D9A441]" />
                    <span>LIVE DEMO</span>
                  </a>
                )}

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#A5AAB2] hover:text-[#F3F1EB] bg-[#101927] hover:bg-[#17191D] border border-white/10 rounded-xl transition-colors ml-auto"
                  title="View Source Code"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

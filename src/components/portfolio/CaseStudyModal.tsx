import React, { useState } from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers, Cpu, Terminal, ArrowRight, Play } from 'lucide-react';
import { ProjectItem } from '../../data/projects';
import { DocProcessingDemo } from './DocProcessingDemo';
import { BCodeIDEDemo } from './BCodeIDEDemo';

interface CaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'case-study' | 'architecture' | 'demo'>('case-study');

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#080C13] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#F3F1EB]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#101927]">
          <div>
            <div className="text-[11px] font-mono text-[#D9A441] tracking-wider uppercase">
              {project.code} · {project.category}
            </div>
            <h2 className="text-xl font-bold font-heading text-[#F3F1EB] mt-0.5">
              {project.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#A5AAB2] hover:text-[#F3F1EB] bg-[#080C13] hover:bg-[#17191D] rounded-lg transition-colors border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#030407] border-b border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab('case-study')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'case-study'
                ? 'bg-[#FF6A00]/20 text-[#FF9D42] border border-[#FF6A00]/40 font-semibold'
                : 'text-[#A5AAB2] hover:text-[#F3F1EB]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CASE STUDY</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'architecture'
                ? 'bg-[#FF6A00]/20 text-[#FF9D42] border border-[#FF6A00]/40 font-semibold'
                : 'text-[#A5AAB2] hover:text-[#F3F1EB]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SYSTEM ARCHITECTURE</span>
          </button>

          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'demo'
                ? 'bg-[#FF6A00]/20 text-[#FF9D42] border border-[#FF6A00]/40 font-semibold'
                : 'text-[#A5AAB2] hover:text-[#F3F1EB]'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>INTERACTIVE PROTOTYPE</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {activeTab === 'case-study' && (
            <>
              {/* 1. Overview & Problem Statement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#101927] border border-white/10 rounded-xl p-5">
                  <div className="text-xs font-mono text-[#D9A441] font-semibold mb-2">01. PROJECT OVERVIEW</div>
                  <p className="text-sm leading-relaxed text-[#A5AAB2]">
                    {project.caseStudy.overview}
                  </p>
                </div>

                <div className="bg-[#101927] border border-white/10 rounded-xl p-5">
                  <div className="text-xs font-mono text-[#D9A441] font-semibold mb-2">02. PROBLEM STATEMENT</div>
                  <p className="text-sm leading-relaxed text-[#A5AAB2]">
                    {project.caseStudy.problemStatement}
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <div className="text-xs font-mono text-[#A5AAB2] mb-2 uppercase tracking-wider">VERIFIED TECHNOLOGIES</div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 text-xs font-mono bg-[#101927] border border-white/10 rounded-lg text-[#F3F1EB]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Technical Implementation */}
              <div>
                <h3 className="text-sm font-mono text-[#D9A441] font-semibold uppercase tracking-wider mb-3">
                  03. TECHNICAL IMPLEMENTATION
                </h3>
                <div className="space-y-2">
                  {project.caseStudy.technicalImplementation.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-[#101927]/60 border border-white/5 rounded-xl p-3.5 text-sm text-[#F3F1EB]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Engineering Challenges & Solutions */}
              <div>
                <h3 className="text-sm font-mono text-[#D9A441] font-semibold uppercase tracking-wider mb-3">
                  04. ENGINEERING CHALLENGES & SOLUTIONS
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {project.caseStudy.engineeringChallenges.map((ec, idx) => (
                    <div key={idx} className="bg-[#101927] border border-white/10 rounded-xl p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#FF9D42]">
                        <Cpu className="w-4 h-4 text-[#FF6A00]" />
                        <span>CHALLENGE: {ec.challenge}</span>
                      </div>
                      <p className="text-sm text-[#A5AAB2] pl-6 border-l-2 border-[#FF6A00]/40">
                        <strong className="text-[#F3F1EB] font-mono text-xs block mb-1">ENGINEERING SOLUTION:</strong>
                        {ec.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Results & Verified Outcomes */}
              <div>
                <h3 className="text-sm font-mono text-[#D9A441] font-semibold uppercase tracking-wider mb-3">
                  05. VERIFIED OUTCOMES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.caseStudy.results.map((res, idx) => (
                    <div key={idx} className="bg-[#101927] border border-white/10 rounded-xl p-4 text-xs font-mono text-[#F3F1EB]">
                      <span className="text-[#FF9D42] block font-bold mb-1">METRIC 0{idx + 1}</span>
                      {res}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="bg-[#101927] border border-white/10 rounded-xl p-5">
                <h3 className="text-xs font-mono text-[#D9A441] font-semibold mb-1">SYSTEM ARCHITECTURE OVERVIEW</h3>
                <p className="text-sm text-[#A5AAB2]">
                  {project.caseStudy.systemArchitecture.description}
                </p>
              </div>

              {/* Architecture Nodes Grid */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-[#A5AAB2] uppercase">SYSTEM COMPONENTS</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.caseStudy.systemArchitecture.nodes.map(node => (
                    <div key={node.id} className="bg-[#101927] border border-white/10 rounded-xl p-4 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#F3F1EB] font-bold">{node.label}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-[#D9A441] uppercase">{node.type}</span>
                      </div>
                      <p className="text-xs text-[#A5AAB2] mt-1">{node.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Data Flow List */}
              <div className="bg-[#030407] border border-white/10 rounded-xl p-5 space-y-3">
                <div className="text-xs font-mono text-[#D9A441] font-semibold">SEQUENTIAL DATA FLOW PIPELINE</div>
                <div className="space-y-2">
                  {project.caseStudy.systemArchitecture.flows.map((flow, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-mono text-[#A5AAB2] bg-[#101927] p-2.5 rounded-lg border border-white/5">
                      <ArrowRight className="w-4 h-4 text-[#FF6A00] shrink-0" />
                      <span className="text-[#F3F1EB] font-medium">{flow.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'demo' && (
            <div className="space-y-4">
              <div className="bg-[#101927] border border-white/10 rounded-xl p-4 text-xs font-mono text-[#A5AAB2] flex items-center justify-between">
                <span>INTERACTIVE PROTOTYPE ENVIRONMENT</span>
                <span className="text-emerald-400 font-semibold">STATUS: PROTOTYPE ACTIVE</span>
              </div>

              {project.id === 'intelligent-document-processing' ? (
                <DocProcessingDemo />
              ) : (
                <BCodeIDEDemo />
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#101927]">
          <div className="flex items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-[#F3F1EB] bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>SOURCE CODE</span>
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-[#030407] bg-[#FF6A00] hover:bg-[#FF9D42] font-bold rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>OPEN LIVE DEMO</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-[#A5AAB2] hover:text-[#F3F1EB] transition-colors"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};

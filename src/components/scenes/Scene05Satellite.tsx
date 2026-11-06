import React from 'react';
import { Radio, ShieldCheck, Cpu, Layers, FileText } from 'lucide-react';
import { getProjectById } from '../../utils/portfolioUtils';
import { ProjectItem } from '../../data/projects';

interface Scene05SatelliteProps {
  onOpenCaseStudy: (project: ProjectItem) => void;
}

export const Scene05Satellite: React.FC<Scene05SatelliteProps> = ({ onOpenCaseStudy }) => {
  const flagship = getProjectById('intelligent-document-processing');

  return (
    <section id="scene-05" className="min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 relative z-10">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        
        {/* Header */}
        <div className="space-y-3 text-center md:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101927] border border-white/10 text-xs font-mono text-emerald-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>SCENE 05: SATELLITE DEPLOYMENT · ENGINEERING PROOF</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-[#F3F1EB] tracking-tight">
            BUILT TO DEPLOY <span className="text-[#FF6A00]">IDEAS INTO REALITY.</span>
          </h2>

          <p className="text-base font-sans text-[#A5AAB2]">
            "From designing systems to delivering software, the objective is to create products that solve meaningful problems."
          </p>
        </div>

        {/* Flagship Engineering Deep Dive Panel */}
        {flagship && (
          <div className="bg-[#080C13]/85 backdrop-blur-md border border-white/15 rounded-2xl p-6 md:p-10 space-y-8 shadow-2xl">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  FLAGSHIP MISSION PROOF · DEPLOYED SATELLITE PAYLOAD
                </span>
                <h3 className="text-2xl font-bold font-heading text-[#F3F1EB] mt-1">
                  {flagship.name}
                </h3>
              </div>

              <button
                onClick={() => onOpenCaseStudy(flagship)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6A00] hover:bg-[#FF9D42] text-[#030407] font-bold font-mono text-xs rounded-xl transition-all shadow-lg shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span>EXPLORE ARCHITECTURE</span>
              </button>
            </div>

            {/* Engineering Highlights specified in prompt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#101927] border border-white/10 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D9A441] font-bold">
                  <Layers className="w-4 h-4" />
                  <span>DECOUPLED WORKER QUEUES</span>
                </div>
                <p className="text-xs font-sans text-[#A5AAB2] leading-relaxed">
                  Separates file ingestion streams from layout parsing queues. Isolates upload throughput so multi-page PDF rendering worker threads run asynchronously without blocking server HTTP event loops.
                </p>
              </div>

              <div className="bg-[#101927] border border-white/10 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>TYPE-SAFE ZOD RUNTIME SCHEMA VALIDATION</span>
                </div>
                <p className="text-xs font-sans text-[#A5AAB2] leading-relaxed">
                  Enforces strict runtime Zod schema validation over extracted key-value pairs, dates, amounts, and nested tables to prevent corrupted JSON payloads from entering persistent storage.
                </p>
              </div>

            </div>

            {/* Architecture Dataflow */}
            <div className="bg-[#030407] border border-white/10 rounded-xl p-6 space-y-3 font-mono text-xs">
              <div className="text-[#D9A441] font-bold">VERIFIED PIPELINE ARCHITECTURE:</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[#A5AAB2]">
                <div className="p-3 bg-[#101927] rounded-lg border border-white/5 text-center">
                  <span className="text-[#F3F1EB] block font-bold mb-1">1. INGESTION</span>
                  Stream Chunking
                </div>
                <div className="p-3 bg-[#101927] rounded-lg border border-white/5 text-center">
                  <span className="text-[#F3F1EB] block font-bold mb-1">2. WORKER QUEUE</span>
                  Async Job Pipeline
                </div>
                <div className="p-3 bg-[#101927] rounded-lg border border-white/5 text-center">
                  <span className="text-[#F3F1EB] block font-bold mb-1">3. EXTRACTION</span>
                  Zod Schema Parse
                </div>
                <div className="p-3 bg-[#101927] rounded-lg border border-white/5 text-center">
                  <span className="text-[#F3F1EB] block font-bold mb-1">4. STORAGE</span>
                  PostgreSQL Persistence
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

import React from 'react';
import { ArrowDown, Rocket, FileText, ChevronDown } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';

interface Scene01LaunchProps {
  onExploreWork: () => void;
  onOpenResume: () => void;
}

export const Scene01Launch: React.FC<Scene01LaunchProps> = ({ onExploreWork, onOpenResume }) => {
  return (
    <section id="scene-01" className="min-h-screen flex flex-col justify-between py-24 px-4 md:px-8 relative z-10">
      
      {/* Top Kicker Badge */}
      <div className="max-w-7xl mx-auto w-full pt-8">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#101827]/80 border border-[#70C7FF]/30 text-xs font-mono text-[#70C7FF] shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#70C7FF]" />
          <span>MISSION: ORBIT · SCENE 01: LAUNCHPAD</span>
        </div>
      </div>

      {/* Main Hero Typographic Left Safe Zone Column */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 my-auto">
        
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-2">
            <div className="text-xs font-mono tracking-widest text-[#70C7FF] uppercase font-semibold">
              OPERATOR: BADRI NARAYANAN
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight text-white leading-none">
              BADRI NARAYANAN
            </h1>
            <div className="text-lg sm:text-2xl font-mono text-[#70C7FF] font-semibold tracking-wide">
              FULL STACK DEVELOPER
            </div>
          </div>

          <p className="text-lg sm:text-xl font-sans text-[#F4F7FC] leading-relaxed font-normal text-balance">
            "{personalInfo.primaryStatement}"
          </p>

          <p className="text-sm sm:text-base font-sans text-[#8B98AA] leading-relaxed">
            {personalInfo.supportingStatement}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreWork}
              className="group flex items-center gap-2.5 px-6 py-3.5 bg-[#70C7FF] hover:bg-[#B4D7FF] text-[#03050B] font-bold font-mono rounded-xl transition-all shadow-xl hover:shadow-[#70C7FF]/20 text-sm"
            >
              <Rocket className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              <span>EXPLORE MY WORK</span>
            </button>

            <button
              onClick={onOpenResume}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-[#101827]/80 hover:bg-[#1E293B] border border-[#70C7FF]/30 hover:border-[#70C7FF] text-[#70C7FF] font-semibold font-mono rounded-xl transition-all backdrop-blur-md text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>VIEW RESUME</span>
            </button>
          </div>
        </div>

        {/* Empty Right Column Reserved for 3D Rocket Launchpad Framing */}
        <div className="hidden lg:block lg:col-span-5 pointer-events-none min-h-[300px]" aria-hidden="true" />

      </div>

      {/* Scroll Prompt & Telemetry Indicator */}
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center gap-2 text-center text-xs font-mono text-[#8B98AA]">
        <div className="flex items-center gap-2">
          <span>SCROLL TO INITIATE MISSION COUNTDOWN</span>
          <ChevronDown className="w-4 h-4 text-[#70C7FF] animate-bounce" />
        </div>
      </div>

    </section>
  );
};

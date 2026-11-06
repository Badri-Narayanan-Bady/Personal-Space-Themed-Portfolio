import React from 'react';
import { Flame, Target, Cpu, RefreshCw } from 'lucide-react';

export const Scene02Ignition: React.FC = () => {
  return (
    <section id="scene-02" className="min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 relative z-10">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        
        {/* Header Kicker & Headline */}
        <div className="space-y-4 text-center md:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101827] border border-[#70C7FF]/30 text-xs font-mono text-[#70C7FF]">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>SCENE 02: STAGE 1 IGNITION · ENGINEERING PHILOSOPHY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight leading-tight">
            EVERY GREAT SYSTEM <br />
            <span className="text-[#70C7FF]">STARTS WITH AN IDEA.</span>
          </h2>

          <p className="text-base sm:text-lg font-sans text-[#8B98AA] leading-relaxed">
            "I approach software development as an engineering discipline: understand the problem, design the system, build the solution and continuously improve it."
          </p>
        </div>

        {/* 3 Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Principle 01 */}
          <div className="bg-[#101827]/90 backdrop-blur-md border border-[#70C7FF]/20 hover:border-[#70C7FF]/50 rounded-2xl p-6 space-y-4 transition-all duration-300 shadow-xl group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#70C7FF] font-bold">01. PRINCIPLE</span>
              <div className="p-2 bg-[#70C7FF]/10 text-[#70C7FF] rounded-lg group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-xl font-bold font-heading text-white">
              THINK SYSTEMATICALLY
            </h3>

            <p className="text-sm font-sans text-[#8B98AA] leading-relaxed">
              Understand the problem before choosing the implementation. Analyze constraints, data structures, and access patterns to design clean system interfaces.
            </p>
          </div>

          {/* Principle 02 */}
          <div className="bg-[#101827]/90 backdrop-blur-md border border-[#70C7FF]/20 hover:border-[#70C7FF]/50 rounded-2xl p-6 space-y-4 transition-all duration-300 shadow-xl group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#70C7FF] font-bold">02. PRINCIPLE</span>
              <div className="p-2 bg-[#70C7FF]/10 text-[#70C7FF] rounded-lg group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-xl font-bold font-heading text-white">
              BUILD END TO END
            </h3>

            <p className="text-sm font-sans text-[#8B98AA] leading-relaxed">
              Connect interfaces, backend logic, data and infrastructure into cohesive systems. Ensure type safety from database schemas to client UI states.
            </p>
          </div>

          {/* Principle 03 */}
          <div className="bg-[#101827]/90 backdrop-blur-md border border-[#70C7FF]/20 hover:border-[#70C7FF]/50 rounded-2xl p-6 space-y-4 transition-all duration-300 shadow-xl group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#70C7FF] font-bold">03. PRINCIPLE</span>
              <div className="p-2 bg-[#70C7FF]/10 text-[#70C7FF] rounded-lg group-hover:scale-110 transition-transform">
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-xl font-bold font-heading text-white">
              ITERATE AND IMPROVE
            </h3>

            <p className="text-sm font-sans text-[#8B98AA] leading-relaxed">
              Treat reliability, maintainability and user experience as engineering priorities. Continuously refactor code and optimize execution speed.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

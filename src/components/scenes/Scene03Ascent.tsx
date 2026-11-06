import React, { useState } from 'react';
import { Layers, Info, Code2, Server, Database, Wrench, BookOpen, X } from 'lucide-react';
import { skillCategories, SkillCategory, SkillItem } from '../../data/skills';

export const Scene03Ascent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSkillModal, setActiveSkillModal] = useState<SkillItem | null>(null);

  const filteredCategories = selectedCategory === 'ALL'
    ? skillCategories
    : skillCategories.filter(c => c.code === selectedCategory);

  const getCategoryIcon = (code: string) => {
    switch (code) {
      case 'A': return <Code2 className="w-4 h-4 text-[#70C7FF]" />;
      case 'B': return <Layers className="w-4 h-4 text-[#70C7FF]" />;
      case 'C': return <Server className="w-4 h-4 text-[#70C7FF]" />;
      case 'D': return <Database className="w-4 h-4 text-[#70C7FF]" />;
      case 'E': return <Wrench className="w-4 h-4 text-[#70C7FF]" />;
      case 'F': return <BookOpen className="w-4 h-4 text-[#70C7FF]" />;
      default: return <Layers className="w-4 h-4 text-[#70C7FF]" />;
    }
  };

  return (
    <section id="scene-03" className="min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 relative z-10">
      <div className="max-w-7xl mx-auto w-full space-y-10">
        
        {/* Header Kicker & Headline */}
        <div className="space-y-3 text-center md:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101827] border border-[#70C7FF]/30 text-xs font-mono text-[#70C7FF]">
            <Layers className="w-3.5 h-3.5 text-[#70C7FF]" />
            <span>SCENE 03: ATMOSPHERIC ASCENT · TECHNICAL CAPABILITIES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
            THE TECHNOLOGY <span className="text-[#70C7FF]">BEHIND THE MISSION.</span>
          </h2>

          <p className="text-base font-sans text-[#8B98AA]">
            "A full-stack engineering approach, from user interfaces to backend systems."
          </p>
        </div>

        {/* Category Filter Tabs (Interactive Controls) */}
        <div className="flex items-center gap-2 p-1.5 bg-[#101827]/90 border border-[#70C7FF]/20 rounded-xl overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-[#70C7FF] text-[#03050B] font-bold shadow-md'
                : 'text-[#8B98AA] hover:text-white'
            }`}
          >
            ALL MODULES
          </button>
          {skillCategories.map(cat => (
            <button
              key={cat.code}
              onClick={() => setSelectedCategory(cat.code)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.code
                  ? 'bg-[#70C7FF] text-[#03050B] font-bold shadow-md'
                  : 'text-[#8B98AA] hover:text-white'
              }`}
            >
              <span>{cat.code}.</span>
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Structured Technical HUD Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(category => (
            <div
              key={category.code}
              className="bg-[#101827]/90 backdrop-blur-md border border-[#70C7FF]/20 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#70C7FF]/15 pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#70C7FF] font-bold">
                    {getCategoryIcon(category.code)}
                    <span>MODULE {category.code}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#8B98AA]">{category.skills.length} UNITS</span>
                </div>

                <h3 className="text-lg font-bold font-heading text-white">
                  {category.title}
                </h3>
                <p className="text-xs font-sans text-[#8B98AA]">
                  {category.description}
                </p>
              </div>

              {/* Skills Items List inside Module */}
              <div className="space-y-2.5 pt-2">
                {category.skills.map(skill => (
                  <div
                    key={skill.name}
                    onClick={() => setActiveSkillModal(skill)}
                    className="group flex items-center justify-between p-2.5 rounded-xl bg-[#080D18]/80 hover:bg-[#1E293B] border border-[#70C7FF]/10 hover:border-[#70C7FF]/40 transition-all cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-mono font-semibold text-white group-hover:text-[#70C7FF] transition-colors">
                        {skill.name}
                      </div>
                      {/* Unboxed clean metadata separators — anti-slop */}
                      <div className="text-[11px] font-mono text-[#8B98AA] flex items-center gap-1.5">
                        {skill.tags.map((t, idx) => (
                          <React.Fragment key={t}>
                            {idx > 0 && <span>·</span>}
                            <span>{t}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <Info className="w-3.5 h-3.5 text-[#8B98AA] group-hover:text-[#70C7FF] transition-colors shrink-0" />
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Skill Detail Modal */}
      {activeSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#080D18] border border-[#70C7FF]/40 rounded-2xl p-6 max-w-md w-full space-y-4 text-[#F4F7FC]">
            <div className="flex items-center justify-between border-b border-[#70C7FF]/20 pb-3">
              <div>
                <span className="text-xs font-mono text-[#70C7FF] uppercase">{activeSkillModal.category}</span>
                <h4 className="text-xl font-bold font-heading text-white">{activeSkillModal.name}</h4>
              </div>
              <button
                onClick={() => setActiveSkillModal(null)}
                className="p-1.5 text-[#8B98AA] hover:text-white rounded-lg hover:bg-[#101827]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm font-sans text-[#8B98AA] leading-relaxed">
              {activeSkillModal.description}
            </p>

            <div className="text-xs font-mono text-[#70C7FF] pt-2 border-t border-[#70C7FF]/10">
              TAGS: {activeSkillModal.tags.join(' · ')}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

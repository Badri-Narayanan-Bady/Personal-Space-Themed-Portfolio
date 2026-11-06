import React from 'react';
import { Rocket, FileText, Send, Github, Linkedin } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';

interface HeaderProps {
  onOpenResume: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenResume, onNavigate, activeSection }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#030407]/85 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('scene-01')}
          className="flex items-center gap-2.5 text-lg font-bold font-heading tracking-wider text-[#F3F1EB] hover:text-[#FF6A00] transition-colors whitespace-nowrap shrink-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FF6A00]/10 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00]">
            <Rocket className="w-4 h-4" />
          </div>
          <span>ORBIT <span className="text-xs font-mono font-normal text-[#A5AAB2] ml-1">/ BADRI NARAYANAN</span></span>
        </button>

        {/* Zone 2: 4 Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-medium text-[#A5AAB2]">
          <button
            onClick={() => onNavigate('scene-01')}
            className={`hover:text-[#F3F1EB] transition-colors whitespace-nowrap shrink-0 ${activeSection === 'scene-01' ? 'text-[#FF6A00] font-semibold' : ''}`}
          >
            01. LAUNCH
          </button>
          <button
            onClick={() => onNavigate('scene-03')}
            className={`hover:text-[#F3F1EB] transition-colors whitespace-nowrap shrink-0 ${activeSection === 'scene-03' ? 'text-[#FF6A00] font-semibold' : ''}`}
          >
            02. SKILLS
          </button>
          <button
            onClick={() => onNavigate('scene-04')}
            className={`hover:text-[#F3F1EB] transition-colors whitespace-nowrap shrink-0 ${activeSection === 'scene-04' ? 'text-[#FF6A00] font-semibold' : ''}`}
          >
            03. PROJECTS
          </button>
          <button
            onClick={() => onNavigate('scene-06')}
            className={`hover:text-[#F3F1EB] transition-colors whitespace-nowrap shrink-0 ${activeSection === 'scene-06' ? 'text-[#FF6A00] font-semibold' : ''}`}
          >
            04. CONTACT
          </button>
        </nav>

        {/* Zone 3: Primary Action & Social Links */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-2 text-[#A5AAB2] hover:text-[#FF6A00] hover:bg-[#101927] rounded-lg transition-colors border border-transparent hover:border-white/10"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-2 text-[#A5AAB2] hover:text-[#FF6A00] hover:bg-[#101927] rounded-lg transition-colors border border-transparent hover:border-white/10"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenResume}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium text-[#F3F1EB] bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg transition-all whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>RESUME</span>
          </button>

          <button
            onClick={() => onNavigate('scene-06')}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-bold text-[#030407] bg-[#FF6A00] hover:bg-[#FF9D42] rounded-lg transition-all whitespace-nowrap shrink-0 shadow-lg"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CONTACT</span>
          </button>
        </div>

      </div>
    </header>
  );
};

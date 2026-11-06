import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, Code } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';

interface FooterProps {
  onReplayMission: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayMission }) => {
  return (
    <footer className="relative z-10 bg-[#080C13] border-t border-white/10 pt-12 pb-24 px-4 md:px-8 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="text-[#F3F1EB] font-bold font-heading text-base tracking-wider flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
            THE NEXT MISSION STARTS HERE.
          </div>
          <p className="text-[#A5AAB2] text-sm font-sans mt-0.5">
            "Thanks for exploring my universe."
          </p>
          <div className="text-[#A5AAB2] text-[11px] mt-2">
            OPERATOR: <span className="text-[#F3F1EB]">{personalInfo.name.toUpperCase()}</span> · TITLE: <span className="text-[#F3F1EB]">{personalInfo.title.toUpperCase()}</span>
          </div>
        </div>

        {/* Center: Replay Mission CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReplayMission}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 border border-[#FF6A00]/30 hover:border-[#FF6A00] text-[#FF9D42] font-semibold rounded-xl transition-all shadow-lg text-xs"
          >
            <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>REPLAY MISSION</span>
          </button>
        </div>

        {/* Right Column: Links */}
        <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
          <div className="flex items-center gap-3">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 text-[#A5AAB2] hover:text-[#FF6A00] bg-[#101927] rounded-lg transition-colors border border-white/10 hover:border-white/20"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 text-[#A5AAB2] hover:text-[#FF6A00] bg-[#101927] rounded-lg transition-colors border border-white/10 hover:border-white/20"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              aria-label="Send Email"
              className="p-2 text-[#A5AAB2] hover:text-[#FF6A00] bg-[#101927] rounded-lg transition-colors border border-white/10 hover:border-white/20"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <div className="text-[#A5AAB2] text-[11px] flex items-center gap-1.5">
            <Code className="w-3 h-3 text-[#FF6A00]" />
            <span>Engineered by Badri Narayanan · {new Date().getFullYear()}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

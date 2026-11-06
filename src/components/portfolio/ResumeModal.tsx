import React from 'react';
import { X, Printer, Mail, Github, Linkedin, Award, GraduationCap, Briefcase, Code2 } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#080C13] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#F3F1EB]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#101927]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-lg text-[#FF6A00]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-[#F3F1EB]">
                {personalInfo.name} — CURRICULUM VITAE
              </h2>
              <div className="text-xs font-mono text-[#A5AAB2]">
                FULL STACK DEVELOPER · SOFTWARE ENGINEERING PORTFOLIO
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#F3F1EB] bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#D9A441]" />
              <span className="hidden sm:inline">PRINT / EXPORT</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#A5AAB2] hover:text-[#F3F1EB] bg-[#080C13] hover:bg-[#17191D] rounded-lg transition-colors border border-white/10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Resume Sheet */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 print:p-0 print:bg-white print:text-black">
          
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-2xl font-bold font-heading text-[#F3F1EB] tracking-wide">
              {personalInfo.name}
            </h1>
            <div className="text-sm font-mono text-[#D9A441] font-semibold mt-1">
              {personalInfo.title}
            </div>
            <p className="text-sm text-[#A5AAB2] mt-2 max-w-2xl leading-relaxed">
              {personalInfo.biography}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#A5AAB2] mt-4">
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-[#FF6A00]">
                <Mail className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>{personalInfo.email}</span>
              </a>
              <span>·</span>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#FF6A00]">
                <Github className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>GitHub Profile</span>
              </a>
              <span>·</span>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#FF6A00]">
                <Linkedin className="w-3.5 h-3.5 text-[#8CAFCB]" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>

          {/* Technical Experience */}
          <div>
            <h3 className="text-sm font-mono text-[#D9A441] font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#FF6A00]" />
              <span>TECHNICAL EXPERIENCE</span>
            </h3>
            <div className="space-y-6">
              {personalInfo.experience.map((exp, idx) => (
                <div key={idx} className="bg-[#101927] border border-white/10 rounded-xl p-5 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-base font-bold text-[#F3F1EB]">{exp.role} — <span className="text-[#D9A441]">{exp.company}</span></h4>
                    <span className="text-xs font-mono text-[#A5AAB2]">{exp.period}</span>
                  </div>
                  <p className="text-xs text-[#A5AAB2]">{exp.description}</p>
                  <ul className="list-disc list-inside text-xs text-[#F3F1EB] space-y-1 pt-2">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-sm font-mono text-[#D9A441] font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#8CAFCB]" />
              <span>EDUCATION</span>
            </h3>
            <div className="space-y-4">
              {personalInfo.education.map((edu, idx) => (
                <div key={idx} className="bg-[#101927] border border-white/10 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-base font-bold text-[#F3F1EB]">{edu.degree}</h4>
                    <span className="text-xs font-mono text-[#A5AAB2]">{edu.year}</span>
                  </div>
                  <div className="text-xs font-mono text-[#8CAFCB] mt-1">{edu.institution}</div>
                  <p className="text-xs text-[#A5AAB2] mt-2">{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Achievements */}
          <div>
            <h3 className="text-sm font-mono text-[#D9A441] font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF9D42]" />
              <span>VERIFIED ACHIEVEMENTS</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personalInfo.achievements.map((ach, idx) => (
                <div key={idx} className="bg-[#101927] border border-white/10 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#F3F1EB] font-bold">{ach.title}</span>
                    <span className="text-[#A5AAB2]">{ach.date}</span>
                  </div>
                  <div className="text-xs font-mono text-[#D9A441]">{ach.issuer}</div>
                  <p className="text-xs text-[#A5AAB2] mt-1">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Summary */}
          <div>
            <h3 className="text-sm font-mono text-[#D9A441] font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#FF6A00]" />
              <span>CORE TECHNICAL COMPETENCIES</span>
            </h3>
            <div className="bg-[#101927] border border-white/10 rounded-xl p-5 text-xs font-mono space-y-2 text-[#A5AAB2]">
              <div><strong className="text-[#F3F1EB]">Languages:</strong> TypeScript, JavaScript, Python, C/C++, SQL, HTML5, CSS3</div>
              <div><strong className="text-[#F3F1EB]">Frontend:</strong> React, Vite, Next.js, Tailwind CSS, Three.js, WebGL, Modern State Management</div>
              <div><strong className="text-[#F3F1EB]">Backend & DB:</strong> Node.js, Express, REST APIs, WebSockets, PostgreSQL, MongoDB, Firebase, Redis, ORMs</div>
              <div><strong className="text-[#F3F1EB]">Infrastructure & CS:</strong> Git, Docker, Linux, System Design, Algorithms, Data Structures, Web Performance</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#101927]">
          <span className="text-xs font-mono text-[#A5AAB2]">
            BADRI NARAYANAN · FULL STACK DEVELOPER
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-[#F3F1EB] bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg transition-colors"
          >
            CLOSE RESUME
          </button>
        </div>

      </div>
    </div>
  );
};

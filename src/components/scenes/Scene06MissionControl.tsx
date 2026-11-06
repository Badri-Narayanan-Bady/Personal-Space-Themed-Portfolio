import React, { useState } from 'react';
import { Radio, Mail, Send, Github, Linkedin, FileText, CheckCircle2, GraduationCap, Award, HeartHandshake } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';
import { validateContactForm } from '../../utils/portfolioUtils';

interface Scene06MissionControlProps {
  onOpenResume: () => void;
}

export const Scene06MissionControl: React.FC<Scene06MissionControlProps> = ({ onOpenResume }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="scene-06" className="min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 relative z-10">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        
        {/* Header */}
        <div className="space-y-3 text-center md:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101927] border border-white/10 text-xs font-mono text-[#D9A441]">
            <Radio className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>SCENE 06: MISSION CONTROL · ABOUT & CONTACT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-[#F3F1EB] tracking-tight">
            MISSION <span className="text-[#FF6A00]">CONTROL.</span>
          </h2>

          <p className="text-base font-sans text-[#A5AAB2]">
            "Have an interesting engineering problem? Let's work on it."
          </p>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: About & Credentials */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* About Card */}
            <div className="bg-[#080C13]/85 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D9A441] font-bold border-b border-white/10 pb-3">
                <HeartHandshake className="w-4 h-4 text-[#FF6A00]" />
                <span>ABOUT BADRI NARAYANAN</span>
              </div>
              <p className="text-sm font-sans text-[#F3F1EB] leading-relaxed">
                {personalInfo.biography}
              </p>

              <div className="pt-2 border-t border-white/10 text-xs font-mono text-[#A5AAB2]">
                <span className="text-[#D9A441] font-semibold block mb-1">TECHNICAL FOCUS AREAS:</span>
                <div className="flex flex-wrap gap-2">
                  {personalInfo.interests.map(interest => (
                    <span key={interest} className="px-2.5 py-1 rounded-lg bg-[#101927] border border-white/10 text-[#F3F1EB]">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Education & Achievements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Education */}
              <div className="bg-[#080C13]/85 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D9A441] font-bold border-b border-white/10 pb-2">
                  <GraduationCap className="w-4 h-4 text-[#8CAFCB]" />
                  <span>EDUCATION</span>
                </div>
                {personalInfo.education.map((edu, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="font-bold text-[#F3F1EB]">{edu.degree}</div>
                    <div className="text-[#8CAFCB] font-mono">{edu.institution} ({edu.year})</div>
                  </div>
                ))}
              </div>

              {/* Verified Achievements */}
              <div className="bg-[#080C13]/85 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D9A441] font-bold border-b border-white/10 pb-2">
                  <Award className="w-4 h-4 text-[#FF9D42]" />
                  <span>ACHIEVEMENTS</span>
                </div>
                {personalInfo.achievements.map((ach, idx) => (
                  <div key={idx} className="space-y-0.5 text-xs">
                    <div className="font-bold text-[#F3F1EB]">{ach.title}</div>
                    <div className="text-[#A5AAB2]">{ach.issuer} · {ach.date}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-3 bg-[#080C13]/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-[#F3F1EB] bg-[#101927] hover:bg-[#17191D] border border-white/10 rounded-xl transition-colors"
              >
                <Github className="w-4 h-4 text-[#FF6A00]" />
                <span>GITHUB</span>
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-[#F3F1EB] bg-[#101927] hover:bg-[#17191D] border border-white/10 rounded-xl transition-colors"
              >
                <Linkedin className="w-4 h-4 text-[#8CAFCB]" />
                <span>LINKEDIN</span>
              </a>

              <button
                onClick={onOpenResume}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-[#F3F1EB] bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl transition-colors"
              >
                <FileText className="w-4 h-4 text-[#D9A441]" />
                <span>VIEW FULL CV</span>
              </button>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-5 bg-[#080C13]/85 backdrop-blur-md border border-white/15 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
            
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-mono text-[#FF9D42] font-bold uppercase tracking-wider">
                TRANSMIT MESSAGE TO MISSION CONTROL
              </div>
              <h3 className="text-xl font-bold font-heading text-[#F3F1EB] mt-1">
                GET IN TOUCH
              </h3>
            </div>

            {submitted ? (
              <div className="bg-[#101927] border border-emerald-400/40 rounded-xl p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-base font-bold text-[#F3F1EB]">MESSAGE TRANSMITTED</div>
                <p className="text-xs font-mono text-[#A5AAB2] leading-relaxed">
                  Thank you for reaching out! Badri Narayanan will review your message and respond shortly via <span className="text-[#F3F1EB]">{formData.email}</span>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-4 py-2 text-xs font-mono text-[#F3F1EB] bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg transition-colors"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                
                <div className="space-y-1">
                  <label htmlFor="name" className="text-[#A5AAB2] block">YOUR NAME *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Connor"
                    className="w-full bg-[#101927] border border-white/10 rounded-xl px-4 py-2.5 text-[#F3F1EB] placeholder-[#A5AAB2]/40 focus:outline-none focus:border-[#FF6A00] transition-colors"
                  />
                  {errors.name && <span className="text-red-400 text-[11px] block">{errors.name}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-[#A5AAB2] block">YOUR EMAIL *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. sarah@example.com"
                    className="w-full bg-[#101927] border border-white/10 rounded-xl px-4 py-2.5 text-[#F3F1EB] placeholder-[#A5AAB2]/40 focus:outline-none focus:border-[#FF6A00] transition-colors"
                  />
                  {errors.email && <span className="text-red-400 text-[11px] block">{errors.email}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="subject" className="text-[#A5AAB2] block">SUBJECT *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Engineering Project Inquiry"
                    className="w-full bg-[#101927] border border-white/10 rounded-xl px-4 py-2.5 text-[#F3F1EB] placeholder-[#A5AAB2]/40 focus:outline-none focus:border-[#FF6A00] transition-colors"
                  />
                  {errors.subject && <span className="text-red-400 text-[11px] block">{errors.subject}</span>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-[#A5AAB2] block">MESSAGE *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, idea, or engineering role..."
                    className="w-full bg-[#101927] border border-white/10 rounded-xl px-4 py-2.5 text-[#F3F1EB] placeholder-[#A5AAB2]/40 focus:outline-none focus:border-[#FF6A00] transition-colors resize-none"
                  />
                  {errors.message && <span className="text-red-400 text-[11px] block">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF6A00] hover:bg-[#FF9D42] text-[#030407] font-bold font-mono rounded-xl transition-all shadow-lg disabled:opacity-50 text-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

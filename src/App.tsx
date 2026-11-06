import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Header } from './components/layout/Header';
import { MissionHUD } from './components/layout/MissionHUD';
import { Footer } from './components/layout/Footer';
import { ThreeCanvas } from './three/ThreeCanvas';
import { Scene01Launch } from './components/scenes/Scene01Launch';
import { Scene02Ignition } from './components/scenes/Scene02Ignition';
import { Scene03Ascent } from './components/scenes/Scene03Ascent';
import { Scene04Orbit } from './components/scenes/Scene04Orbit';
import { Scene05Satellite } from './components/scenes/Scene05Satellite';
import { Scene06MissionControl } from './components/scenes/Scene06MissionControl';
import { CaseStudyModal } from './components/portfolio/CaseStudyModal';
import { ResumeModal } from './components/portfolio/ResumeModal';
import { ProjectItem } from './data/projects';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('scene-01');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    });

    lenisRef.current = lenis;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? currentScroll / totalScroll : 0;
      setScrollProgress(Math.max(0, Math.min(1, progress)));

      // Determine active section
      const sections = ['scene-01', 'scene-02', 'scene-03', 'scene-04', 'scene-05', 'scene-06'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    lenis.on('scroll', handleScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.5 });
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplayMission = () => {
    handleNavigate('scene-01');
  };

  return (
    <div className="relative min-h-screen bg-[#03050B] text-[#F4F7FC] overflow-x-hidden font-sans">
      
      {/* 3D WebGL Background Canvas */}
      <ThreeCanvas scrollProgress={scrollProgress} activeScene={1} />

      {/* Persistent Navigation Header */}
      <Header
        onOpenResume={() => setIsResumeOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Mission Scenes Sequence */}
      <main className="relative z-10">
        <Scene01Launch
          onExploreWork={() => handleNavigate('scene-04')}
          onOpenResume={() => setIsResumeOpen(true)}
        />
        <Scene02Ignition />
        <Scene03Ascent />
        <Scene04Orbit onOpenCaseStudy={(p) => setSelectedProject(p)} />
        <Scene05Satellite onOpenCaseStudy={(p) => setSelectedProject(p)} />
        <Scene06MissionControl onOpenResume={() => setIsResumeOpen(true)} />
      </main>

      {/* Mission Footer */}
      <Footer onReplayMission={handleReplayMission} />

      {/* Persistent Telemetry HUD */}
      <MissionHUD
        scrollProgress={scrollProgress}
        onJumpToScene={handleNavigate}
      />

      {/* Modals */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

    </div>
  );
}

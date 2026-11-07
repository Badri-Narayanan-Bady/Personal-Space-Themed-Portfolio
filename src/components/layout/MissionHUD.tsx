import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Compass, Activity } from 'lucide-react';
import { MISSION_PHASES, getMissionPhaseFromProgress } from '../../utils/portfolioUtils';

interface MissionHUDProps {
  scrollProgress: number;
  onJumpToScene: (sceneId: string) => void;
}

export const MissionHUD: React.FC<MissionHUDProps> = ({ scrollProgress, onJumpToScene }) => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const currentPhase = getMissionPhaseFromProgress(scrollProgress);

  // Web Audio ambient space drone synthesizer
  const toggleAudio = () => {
    if (!isAudioActive) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(50, ctx.currentTime); // Deep space rumble
        gain.gain.setValueAtTime(0.03, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;

        setIsAudioActive(true);
      } catch {
        setIsAudioActive(false);
      }
    } else {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      setIsAudioActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch { /* ignore */ }
      }
    };
  }, []);

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 px-3 md:px-6 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left Status Readout */}
        <div className="pointer-events-auto bg-[#080C13]/90 backdrop-blur-lg border border-white/10 rounded-full px-3.5 py-1.5 text-[11px] font-mono text-[#F3F1EB] shadow-xl flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse" />
            <span className="text-[#FF9D42] font-semibold">{currentPhase.status}</span>
          </div>

          <div className="hidden md:block h-3 w-px bg-white/15" />

          <div className="hidden md:flex items-center gap-2 text-[#A5AAB2]">
            <Activity className="w-3 h-3 text-[#8CAFCB]" />
            <span>{currentPhase.telemetry}</span>
          </div>
        </div>

        {/* Center Scene Navigation Jumper */}
        <div className="pointer-events-auto bg-[#080C13]/90 backdrop-blur-lg border border-white/10 rounded-full p-1 flex items-center justify-center gap-1 shadow-xl">
          {MISSION_PHASES.map((scene) => {
            const isActive = currentPhase.id === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => onJumpToScene(`scene-0${scene.id}`)}
                className={`px-2 py-0.5 text-[10px] font-mono rounded-full transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FF6A00] text-[#030407] font-bold shadow-md'
                    : 'text-[#A5AAB2] hover:text-[#F3F1EB] hover:bg-white/10'
                }`}
                title={scene.name}
              >
                0{scene.id}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Progress & Audio Toggle */}
        <div className="pointer-events-auto bg-[#080C13]/90 backdrop-blur-lg border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-mono flex items-center gap-3 shadow-xl">
          <div className="hidden sm:flex items-center gap-2">
            <Compass className="w-3 h-3 text-[#8CAFCB]" />
            <span className="w-12 bg-[#030407] h-1.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-[#FF6A00] h-full transition-all duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </span>
            <span className="text-[#F3F1EB] font-semibold">{Math.round(scrollProgress * 100)}%</span>
          </div>

          <div className="hidden sm:block h-3 w-px bg-white/15" />

          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors ${
              isAudioActive
                ? 'text-[#FF9D42] bg-[#FF6A00]/20 border border-[#FF6A00]/40'
                : 'text-[#A5AAB2] hover:text-[#F3F1EB] hover:bg-white/10'
            }`}
            title="Toggle Ambient Audio"
          >
            {isAudioActive ? <Volume2 className="w-3 h-3 text-[#FF6A00]" /> : <VolumeX className="w-3 h-3" />}
            <span className="text-[10px] hidden md:inline">{isAudioActive ? 'AUDIO ON' : 'MUTED'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

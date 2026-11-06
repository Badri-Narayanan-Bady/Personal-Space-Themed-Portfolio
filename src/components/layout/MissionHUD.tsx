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
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 md:p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Left Telemetry Readout */}
        <div className="pointer-events-auto bg-[#080C13]/85 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-[#F3F1EB] shadow-lg flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
            <span className="text-[#A5AAB2]">STATUS:</span>
            <span className="text-[#FF9D42] font-semibold">{currentPhase.status}</span>
          </div>

          <div className="hidden sm:block h-3 w-px bg-white/10" />

          <div className="hidden sm:flex items-center gap-2 text-[#A5AAB2]">
            <Activity className="w-3.5 h-3.5 text-[#8CAFCB]" />
            <span>{currentPhase.telemetry}</span>
          </div>
        </div>

        {/* Center Scene Navigation Jumper */}
        <div className="pointer-events-auto bg-[#080C13]/85 backdrop-blur-md border border-white/10 rounded-xl p-1.5 flex items-center justify-center gap-1 shadow-lg overflow-x-auto">
          {MISSION_PHASES.map((scene) => {
            const isActive = currentPhase.id === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => onJumpToScene(`scene-0${scene.id}`)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FF6A00]/20 text-[#FF9D42] border border-[#FF6A00]/40 font-semibold'
                    : 'text-[#A5AAB2] hover:text-[#F3F1EB] hover:bg-white/5'
                }`}
                title={scene.name}
              >
                0{scene.id}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Progress & Audio */}
        <div className="pointer-events-auto bg-[#080C13]/85 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-xs font-mono flex items-center justify-between md:justify-end gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#8CAFCB]" />
            <span className="text-[#A5AAB2]">ALT:</span>
            <span className="w-16 bg-[#030407] h-1.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-[#FF6A00] h-full transition-all duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </span>
            <span className="text-[#F3F1EB] font-semibold">{Math.round(scrollProgress * 100)}%</span>
          </div>

          <div className="h-3 w-px bg-white/10" />

          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
              isAudioActive
                ? 'text-[#FF9D42] bg-[#FF6A00]/20 border border-[#FF6A00]/40'
                : 'text-[#A5AAB2] hover:text-[#F3F1EB] hover:bg-white/5'
            }`}
            title="Toggle Space Ambiance Audio"
          >
            {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-[#FF6A00]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden sm:inline">{isAudioActive ? 'AUDIO ON' : 'MUTED'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

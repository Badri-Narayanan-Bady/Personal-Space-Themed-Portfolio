import React, { useState } from 'react';
import { Play, Terminal, Code2, Check } from 'lucide-react';

interface Snippet {
  id: string;
  name: string;
  language: string;
  code: string;
}

const SNIPPETS: Snippet[] = [
  {
    id: "telemetry",
    name: "orbit_telemetry.ts",
    language: "TypeScript",
    code: `// B Code IDE — Telemetry Evaluator
interface SatelliteState {
  altitudeKm: number;
  velocityKmS: number;
  solarPanelStatus: 'DEPLOYED' | 'STOWED';
}

function evaluateOrbitState(state: SatelliteState): string {
  const orbitalPeriodMin = 2 * Math.PI * Math.sqrt(Math.pow(6371 + state.altitudeKm, 3) / 398600) / 60;
  console.log(\`[ORBIT] Altitude: \${state.altitudeKm} KM | Period: \${orbitalPeriodMin.toFixed(2)} min\`);
  
  if (state.solarPanelStatus === 'DEPLOYED') {
    return "NOMINAL — FULL SOLAR POWER HARVESTING";
  }
  return "WARNING — AUXILIARY BATTERY ONLY";
}

const mission = { altitudeKm: 420, velocityKmS: 7.68, solarPanelStatus: 'DEPLOYED' as const };
console.log("STATUS:", evaluateOrbitState(mission));`
  },
  {
    id: "algorithm",
    name: "binary_search_tree.ts",
    language: "TypeScript",
    code: `// B Code IDE — Fast Binary Search
function binarySearch(arr: number[], target: number): number {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

const sortedData = [10, 24, 38, 45, 59, 72, 88, 104, 150];
const searchItem = 72;
const index = binarySearch(sortedData, searchItem);

console.log(\`Searching array of size \${sortedData.length} for \${searchItem}...\`);
console.log(\`Target found at index: \${index} (Value: \${sortedData[index]})\`);`
  }
];

export const BCodeIDEDemo: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet>(SNIPPETS[0]);
  const [code, setCode] = useState<string>(SNIPPETS[0].code);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleSelectSnippet = (snip: Snippet) => {
    setSelectedSnippet(snip);
    setCode(snip.code);
    setConsoleOutput([]);
    setExecutionTime(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput([]);

    const startTime = performance.now();
    const logs: string[] = [];

    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      error: (...args: unknown[]) => {
        logs.push(`[ERROR] ${args.join(' ')}`);
      }
    };

    setTimeout(() => {
      try {
        const runFn = new Function('console', code);
        runFn(customConsole);
        const endTime = performance.now();
        setExecutionTime(Math.round((endTime - startTime) * 100) / 100);
        setConsoleOutput(logs.length > 0 ? logs : ["Code executed cleanly with no output."]);
      } catch (err) {
        const endTime = performance.now();
        setExecutionTime(Math.round((endTime - startTime) * 100) / 100);
        setConsoleOutput([`Runtime Error: ${(err as Error).message}`]);
      } finally {
        setIsRunning(false);
      }
    }, 200);
  };

  return (
    <div className="bg-[#030407] border border-white/10 rounded-xl p-5 space-y-6 text-[#F3F1EB]">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101927] border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/30 rounded-lg">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-[#D9A441] font-semibold">B CODE IDE PROTOTYPE</div>
            <div className="text-sm font-bold font-heading text-[#F3F1EB]">Browser Developer Execution Sandbox</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {SNIPPETS.map(snip => (
            <button
              key={snip.id}
              onClick={() => handleSelectSnippet(snip)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                selectedSnippet.id === snip.id
                  ? 'bg-[#FF6A00]/20 text-[#FF9D42] border border-[#FF6A00]/40 font-bold'
                  : 'bg-[#080C13] text-[#A5AAB2] hover:text-[#F3F1EB] border border-white/10'
              }`}
            >
              {snip.name}
            </button>
          ))}

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-bold text-[#030407] bg-[#FF6A00] hover:bg-[#FF9D42] rounded-lg transition-colors shadow-md disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'RUNNING...' : 'EXECUTE'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Code Editor */}
        <div className="bg-[#101927] border border-white/10 rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
            <span className="text-[#A5AAB2] flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#D9A441]" />
              <span>{selectedSnippet.name}</span>
            </span>
            <span className="text-[#D9A441]">{selectedSnippet.language}</span>
          </div>

          <div className="relative bg-[#030407] border border-white/10 rounded-lg p-3 font-mono text-xs flex">
            <div className="select-none text-[#A5AAB2]/40 pr-3 text-right font-mono text-xs space-y-1">
              {code.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-transparent text-[#F3F1EB] focus:outline-none resize-none font-mono text-xs leading-relaxed min-h-[240px]"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right: Console Output */}
        <div className="bg-[#101927] border border-white/10 rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
            <span className="text-[#D9A441] font-semibold flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              <span>CONSOLE OUTPUT</span>
            </span>

            {executionTime !== null && (
              <span className="text-emerald-400 text-[11px]">
                LATENCY: {executionTime}ms
              </span>
            )}
          </div>

          <div className="bg-[#030407] border border-white/10 rounded-lg p-4 font-mono text-xs min-h-[260px] max-h-[300px] overflow-y-auto space-y-2">
            {consoleOutput.length === 0 ? (
              <div className="text-[#A5AAB2]/60 italic">
                Press [EXECUTE] to run script in sandboxed JavaScript environment...
              </div>
            ) : (
              consoleOutput.map((out, idx) => (
                <div key={idx} className="flex items-start gap-2 text-emerald-300">
                  <span className="text-[#FF6A00] select-none">&gt;</span>
                  <span>{out}</span>
                </div>
              ))
            )}
          </div>

          <div className="text-[11px] font-mono text-[#A5AAB2] flex items-center justify-between">
            <span>ENGINE: SANDBOXED JS RUNTIME</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> SAFETY WATCHDOG ACTIVE
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

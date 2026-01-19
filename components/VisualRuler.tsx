
import React, { useMemo } from 'react';

interface VisualRulerProps {
  inches: number;
}

const VisualRuler: React.FC<VisualRulerProps> = ({ inches }) => {
  // We'll show a segment of a ruler. For visualization, let's limit to 12 inches display window
  // but center around the current value if it's large.
  const displayRange = useMemo(() => {
    const start = Math.max(0, Math.floor(inches - 2));
    const end = start + 5;
    const ticks = [];
    for (let i = start; i <= end; i += 0.125) {
      ticks.push(i);
    }
    return { start, end, ticks };
  }, [inches]);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Visual Guide (Inches)</h3>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Scale 1:1 Reference</span>
      </div>
      
      <div className="relative h-24 bg-slate-50 rounded-lg border-b-2 border-slate-300 overflow-x-auto custom-scrollbar">
        <div className="absolute inset-0 flex items-end px-4 min-w-[600px]">
          {displayRange.ticks.map((tick) => {
            const isWhole = Number.isInteger(tick);
            const isHalf = Number.isInteger(tick * 2) && !isWhole;
            const isQuarter = Number.isInteger(tick * 4) && !isWhole && !isHalf;
            
            let height = "h-4";
            if (isWhole) height = "h-12";
            else if (isHalf) height = "h-8";
            else if (isQuarter) height = "h-6";

            return (
              <div 
                key={tick} 
                className="flex flex-col items-center flex-1 min-w-[12px]"
                style={{ opacity: tick > displayRange.end ? 0 : 1 }}
              >
                {isWhole && (
                  <span className="text-[10px] font-bold text-slate-400 mb-1">{tick}</span>
                )}
                <div className={`${height} w-px bg-slate-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Current Value Marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-500 ease-out"
          style={{ 
            left: `${Math.min(100, Math.max(0, ((inches - displayRange.start) / (displayRange.end - displayRange.start)) * 100))}%` 
          }}
        >
          <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-400 italic">
          Visualization centered around <span className="text-slate-600 font-medium">{inches.toFixed(3)}"</span>
        </p>
      </div>
    </div>
  );
};

export default VisualRuler;

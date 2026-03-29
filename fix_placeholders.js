const fs = require('fs');
let fileContent = fs.readFileSync('frontend/src/components/LandingPage.tsx', 'utf8');

// Fix 1: Role Security SVG
fileContent = fileContent.replace(
  '<svg className="w-full h-full transform -rotate-90">',
  '<svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">'
);

// Fix 2: Market Demand Bar Chart (Lines 74-88 logic)
const oldBarChart = `{/* Technical Data Viz */}
<div className="flex-1 h-full flex items-end gap-2">
<div className="w-full bg-secondary/20 h-[40%] rounded-sm relative">
<div className="absolute bottom-0 w-full bg-secondary h-full rounded-sm"></div>
</div>
<div className="w-full bg-secondary/20 h-[65%] rounded-sm relative">
<div className="absolute bottom-0 w-full bg-secondary h-full rounded-sm opacity-60"></div>
</div>
<div className="w-full bg-secondary/20 h-[90%] rounded-sm relative">
<div className="absolute bottom-0 w-full bg-secondary h-full rounded-sm"></div>
</div>
<div className="w-full bg-secondary/20 h-[55%] rounded-sm relative">
<div className="absolute bottom-0 w-full bg-secondary h-full rounded-sm opacity-80"></div>
</div>
</div>`;

const newBarChart = `{/* Technical Data Viz */}
<div className="flex-1 h-full flex items-end gap-6 relative">
  {/* Y-axis lines */}
  <div className="absolute inset-0 flex flex-col justify-between border-l border-white/5 pointer-events-none">
    <div className="w-full border-t border-dashed border-white/5 h-0"></div>
    <div className="w-full border-t border-dashed border-white/5 h-0"></div>
    <div className="w-full border-t border-dashed border-white/5 h-0"></div>
    <div className="w-full border-t border-solid border-white/10 h-0"></div>
  </div>
  {/* Bars */}
  <div className="w-full h-[40%] flex flex-col items-center gap-2 z-10">
    <div className="w-full bg-secondary/20 h-full rounded-t-sm relative group cursor-crosshair">
      <div className="absolute bottom-0 w-full bg-secondary h-full rounded-t-sm transition-all group-hover:bg-[#63f7ff] shadow-[0_0_15px_rgba(0,220,229,0.3)]"></div>
    </div>
    <span className="text-[10px] uppercase text-zinc-500 font-label">Python</span>
  </div>
  <div className="w-full h-[65%] flex flex-col items-center gap-2 z-10">
    <div className="w-full bg-secondary/20 h-full rounded-t-sm relative group cursor-crosshair">
      <div className="absolute bottom-0 w-full bg-secondary h-full rounded-t-sm opacity-60 transition-all group-hover:opacity-100 group-hover:bg-[#63f7ff]"></div>
    </div>
    <span className="text-[10px] uppercase text-zinc-500 font-label">System</span>
  </div>
  <div className="w-full h-[90%] flex flex-col items-center gap-2 z-10">
    <div className="w-full bg-secondary/20 h-full rounded-t-sm relative group cursor-crosshair">
      <div className="absolute bottom-0 w-full bg-secondary h-full rounded-t-sm transition-all group-hover:bg-[#63f7ff] shadow-[0_0_15px_rgba(0,220,229,0.3)]"></div>
    </div>
    <span className="text-[10px] uppercase text-zinc-500 font-label">React</span>
  </div>
  <div className="w-full h-[55%] flex flex-col items-center gap-2 z-10">
    <div className="w-full bg-secondary/20 h-full rounded-t-sm relative group cursor-crosshair">
      <div className="absolute bottom-0 w-full bg-secondary h-full rounded-t-sm opacity-80 transition-all group-hover:opacity-100 group-hover:bg-[#63f7ff]"></div>
    </div>
    <span className="text-[10px] uppercase text-zinc-500 font-label">Cloud</span>
  </div>
</div>`;

fileContent = fileContent.replace(oldBarChart, newBarChart);


// Fix 3: Trajectory Shield empty placeholder
const oldShield = `{/* Grid Row 2 */}
<div className="md:col-span-4 h-[300px] glass-pill p-8 flex flex-col justify-between">
<span className="material-symbols-outlined text-secondary">shield_with_heart</span>
<div>
<h4 className="text-xl font-headline font-bold text-white mb-2">Trajectory Shield</h4>
<p className="text-sm text-[#A0A0A0]">Automated protection against industry obsolescence.</p>
</div>
</div>`;

const newShield = `{/* Grid Row 2 */}
<div className="md:col-span-4 h-[300px] glass-pill p-8 flex flex-col justify-between relative overflow-hidden group">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors"></div>
  
  <div className="flex justify-between items-start z-10">
    <div className="p-3 bg-[#131313] border border-white/10 rounded-xl relative">
      <div className="absolute inset-0 border border-secondary/50 rounded-xl animate-ping opacity-20"></div>
      <span className="material-symbols-outlined text-secondary text-2xl">shield_with_heart</span>
    </div>
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-[#63f7ff] animate-pulse"></div>
        <span className="text-[10px] uppercase tracking-widest text-[#63f7ff]">Active</span>
      </div>
      <span className="text-xs text-zinc-400">1,402 Threats Blocked</span>
    </div>
  </div>

  <div className="z-10 mt-auto">
    <div className="w-full bg-[#131313] h-1.5 rounded-full mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary/20 to-secondary w-[85%] rounded-full shadow-[0_0_10px_rgba(0,220,229,0.5)]"></div>
    </div>
    <h4 className="text-xl font-headline font-bold text-white mb-2">Trajectory Shield</h4>
    <p className="text-sm text-[#A0A0A0] leading-relaxed">Automated protection against industry obsolescence.</p>
  </div>
</div>`;

fileContent = fileContent.replace(oldShield, newShield);

fs.writeFileSync('frontend/src/components/LandingPage.tsx', fileContent);
console.log("Updated LandingPage.tsx with filled placeholders! 🚀");

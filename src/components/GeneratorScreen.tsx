import React, { useState } from 'react';
import { Sparkles, Bolt, Palette, Type as FontIcon, Grid, Layout } from 'lucide-react';

interface GeneratorScreenProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export const GeneratorScreen: React.FC<GeneratorScreenProps> = ({
  onGenerate,
  isGenerating
}) => {
  const [prompt, setPrompt] = useState("");

  const suggestions = [
    "A neon cyberpunk dashboard",
    "Minimalist zen garden store",
    "Futuristic biotech explorer",
    "Luxury coffee brand landing page"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-purple-600/10 blur-[130px] rounded-full animate-fluid-glow"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-pink-500/10 blur-[130px] rounded-full animate-fluid-glow" style={{ animationDelay: '-4s' }}></div>
      </div>

      {/* Hero Header Area */}
      <div className="w-full max-w-4xl text-center space-y-6 relative z-10 pb-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/25 mb-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
          <span className="text-purple-300 font-mono text-[10px] uppercase tracking-widest font-bold">Water Synthesis Engine v2.5</span>
        </div>

        <h1 className="font-display font-black text-5xl md:text-6xl text-white leading-tight tracking-tight">
          Architect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-[length:200%_auto] animate-text-shimmer">Imagination</span>
        </h1>

        <p className="font-sans text-base md:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
          Transform a single thought into a fully immersive digital experience. Our engine interprets context, typography hierarchies, and premium aesthetic tones instantly.
        </p>

        {/* Magic Bar Input bar */}
        <form onSubmit={handleSubmit} className="mt-8 relative group max-w-3xl mx-auto">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-55"></div>
          <div className="relative bg-[#0a0c14]/90 backdrop-blur-3xl p-3 rounded-2xl flex flex-col md:flex-row items-center gap-3 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300">
            <div className="flex-1 w-full px-4 py-3 flex items-center gap-3">
              <Sparkles className="text-purple-400" size={22} />
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter one sentence to build your world..."
                className="bg-transparent border-none outline-none focus:ring-0 text-white font-sans text-base w-full placeholder:text-slate-500"
                disabled={isGenerating}
                id="input_generator_prompt"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:opacity-95 text-white font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(139,92,246,0.35)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              id="btn_generator_submit"
            >
              <span>{isGenerating ? "Synthesizing Space..." : "Incept Space"}</span>
              <Bolt size={15} className={`fill-white ${isGenerating ? "animate-spin" : ""}`} />
            </button>
          </div>
        </form>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap justify-center gap-2.5 mt-8 font-mono">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(sug)}
              className="px-4 py-2 rounded-full border border-white/5 hover:border-purple-500/40 bg-white/[0.02] hover:bg-purple-500/5 text-[#94a3b8] hover:text-purple-300 text-[11px] tracking-wide transition-all duration-200 cursor-pointer"
              id={`chip_suggestion_${idx}`}
            >
              "{sug}"
            </button>
          ))}
        </div>

      </div>

      {/* Feature Showcases Bento list */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6 mt-12 pb-12">
        
        {/* Feature 1 */}
        <div className="md:col-span-8 group bg-[#0a0c14]/70 backdrop-blur-2xl rounded-3xl overflow-hidden p-8 flex flex-col justify-between min-h-[400px] border border-white/5 shadow-xl">
          <div className="space-y-3">
            <span className="text-purple-400 font-mono text-xs tracking-wider uppercase font-semibold">01 / Real-time Synthesis</span>
            <h3 className="font-display font-bold text-2xl text-white">Fluid Generation</h3>
            <p className="text-[#94a3b8] font-sans text-sm max-w-md leading-relaxed">
              Watch as your ideas materialize pixel by pixel. Our engine interprets context, accessibility rules, and luxurious typography simultaneously.
            </p>
          </div>
          <div className="relative h-48 w-full mt-6 rounded-2xl overflow-hidden border border-white/5">
            <img 
              alt="Fluid silky generation artwork" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5bCbdA7_7sxtza9EwOvkN8GMrwYY5_4Am3y1qV0QvMXREj-8dvOB8uQ__070BHhmtbu44KyW2u4RnWcWemaPmcZyz_Mnd3Z2f8GI1TooOcqsQ-jS9Z4i7lmpU0tH9Vg1IwQ0axvzs7N6vgzE_kEKFKvKP-CjZptpcDPE6Cl02vuWi_Hxuogsh3E8wBJYGVd7RMMGMgBMzvmrvdrMzUMDSqiH7gXAhZYra_haSJralyPWBsG_F61678og91nd9SNYc_Brm5fpSVSU"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] to-transparent"></div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="md:col-span-4 bg-[#0a0c14]/70 backdrop-blur-2xl rounded-3xl p-8 flex flex-col items-center text-center justify-center space-y-6 border border-white/5 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.2)] animate-pulse">
            <Sparkles className="text-purple-400" size={34} />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-white">Pure Magic</h3>
            <p className="text-[#94a3b8] font-sans text-sm px-4 leading-relaxed">
              Harnessing the power of advanced models to map and implement the absolute soul of your requirements.
            </p>
          </div>
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-purple-500/30 shadow-md flex items-center justify-center font-mono text-[10px] text-white font-bold">C1</div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-pink-500/30 shadow-md flex items-center justify-center font-mono text-[10px] text-white font-bold">C2</div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-indigo-500/30 shadow-md flex items-center justify-center font-mono text-[10px] text-white font-bold">C3</div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="md:col-span-4 bg-[#0a0c14]/70 backdrop-blur-2xl rounded-3xl p-8 flex flex-col justify-end min-h-[300px] relative group overflow-hidden border border-white/5 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-2">
            <h4 className="font-display font-bold text-lg text-white">Dynamic Flow</h4>
            <p className="text-[#94a3b8] font-sans text-xs leading-relaxed">
              Responsive by nature, beautiful by choice. Adapts flawlessly to any spatial viewport scale.
            </p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="md:col-span-8 bg-[#0a0c14]/70 backdrop-blur-2xl rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden min-h-[300px] border border-white/5 shadow-xl">
          <div className="flex-1 space-y-4">
            <h4 className="font-display font-bold text-xl text-white">Infinite Assets</h4>
            <p className="text-[#94a3b8] font-sans text-xs leading-relaxed">
              Every space generation compiles beautiful logos, bespoke color palettes, and elegant typography matching your brand DNA.
            </p>
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-white/[0.03] backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5"><Palette className="text-purple-400" size={18} /></div>
              <div className="w-12 h-12 bg-white/[0.03] backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5"><FontIcon className="text-pink-400" size={18} /></div>
              <div className="w-12 h-12 bg-white/[0.03] backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5"><Grid className="text-[#a78bfa]" size={18} /></div>
            </div>
          </div>
          <div className="hidden md:block w-1/3">
            <div className="grid grid-cols-2 gap-2 transform rotate-12 scale-110 opacity-30 group-hover:scale-115 transition-transform duration-500">
              <div className="h-24 bg-purple-500/30 rounded-xl"></div>
              <div className="h-24 bg-blue-500/30 rounded-xl"></div>
              <div className="h-24 bg-pink-500/30 rounded-xl"></div>
              <div className="h-24 bg-white/5 rounded-xl"></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default GeneratorScreen;

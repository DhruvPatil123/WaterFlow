import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Palette, 
  MessageSquare, 
  Edit3, 
  Text, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Wand2, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Code, 
  History, 
  Copy 
} from 'lucide-react';
import { Project, LandingPage } from '../types';

interface RefinementSidebarProps {
  activeProject: Project;
  onUpdateParams: (params: Partial<Project['page']>) => void;
  onGenerateNewDraft: () => void;
  onShowToast?: (message: string, type?: "success" | "info" | "warning") => void;
}

export const RefinementSidebar: React.FC<RefinementSidebarProps> = ({
  activeProject,
  onUpdateParams,
  onGenerateNewDraft,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'aesthetics' | 'content' | 'more'>('ai');
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [commandText, setCommandText] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  // Soundscape toggles
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [ambientOsc, setAmbientOsc] = useState<OscillatorNode | null>(null);
  const [ambientGain, setAmbientGain] = useState<GainNode | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // History Log Checkpoints
  const [historyCheckpoints, setHistoryCheckpoints] = useState<LandingPage[]>([]);

  // Code exporter modal
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const page = activeProject.page;

  // Whenever project or page configuration updates, store snapshot in history (if unique)
  useEffect(() => {
    if (!page) return;
    setHistoryCheckpoints(current => {
      // Avoid excessive duplicates
      const lastCheck = current[current.length - 1];
      if (lastCheck && JSON.stringify(lastCheck) === JSON.stringify(page)) {
        return current;
      }
      return [...current.slice(-14), JSON.parse(JSON.stringify(page))]; // Keep last 15 steps
    });
  }, [page]);

  const handleRefinementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandText.trim()) return;
    
    setIsRefining(true);
    setRefineError(null);
    playSynthesizedPing(880, 0.1);
    
    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, command: commandText })
      });

      if (!response.ok) {
        throw new Error("Refinement returned an error status.");
      }

      const updatedPage = await response.json();
      onUpdateParams(updatedPage);
      setCommandText('');
      playSynthesizedPing(1200, 0.2);
    } catch (err: any) {
      console.error(err);
      setRefineError("Failed to apply AI refinement. Please retry.");
      playSynthesizedPing(300, 0.3);
    } finally {
      setIsRefining(false);
    }
  };

  // Preset palettes
  const presetPalettes = [
    {
      name: "Amethyst",
      primary: "#c084fc",
      secondary: "#ec4899",
      tertiary: "#11121d",
      accent: "#6366f1",
      background: "#07080d"
    },
    {
      name: "Cyber Lime",
      primary: "#00ffcc",
      secondary: "#3b82f6",
      tertiary: "#09101f",
      accent: "#22c55e",
      background: "#040712"
    },
    {
      name: "Champagne",
      primary: "#f59e0b",
      secondary: "#f43f5e",
      tertiary: "#1a1005",
      accent: "#fcd34d",
      background: "#0a0601"
    },
    {
      name: "Ruby Noir",
      primary: "#ef4444",
      secondary: "#f59e0b",
      tertiary: "#140404",
      accent: "#f43f5e",
      background: "#050101"
    }
  ];

  // Font choices
  const fontPairingOptions = [
    "Sora & Hanken",
    "Space Grotesk & Inter",
    "Playfair & Georgia",
    "Orbitron & Share Tech",
    "Syne & Plus Jakarta",
    "Fraunces & Sora"
  ] as const;

  const handleFeatureUpdate = (index: number, fields: Partial<typeof page.features[0]>) => {
    const updatedFeatures = [...page.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      ...fields
    };
    onUpdateParams({ features: updatedFeatures });
  };

  const handleAddFeature = () => {
    const newIdx = page.features.length + 1;
    const icons = ["Cpu", "Zap", "Sparkles", "Rocket", "Activity", "Timer", "Flower", "Shield"];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const newFeature = {
      metaLabel: `0${newIdx} / AUTOMATED`,
      title: "New Space Matrix",
      subtitle: "Dynamic telemetry stream",
      description: "This structural block was appended inline via the live client designer pipeline.",
      icon: randomIcon
    };

    onUpdateParams({ features: [...page.features, newFeature] });
    setExpandedFeature(page.features.length); // Expand the newly created feature immediately
    playSynthesizedPing(950, 0.15);
  };

  const handleDeleteFeature = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (page.features.length <= 1) {
      if (onShowToast) {
        onShowToast("At least one Bento grid block is required.", "warning");
      } else {
        alert("At least one Bento grid block is required.");
      }
      return;
    }
    const updated = page.features.filter((_, idx) => idx !== index);
    onUpdateParams({ features: updated });
    setExpandedFeature(null);
    playSynthesizedPing(450, 0.1);
  };

  // Pure Web Audio API Synthesizers (100% standalone, solid)
  const toggleSoundscape = () => {
    if (isAudioPlaying) {
      // Disconnect smoothly
      try {
        if (ambientOsc) {
          ambientOsc.stop();
          ambientOsc.disconnect();
        }
        if (ambientGain) {
          ambientGain.disconnect();
        }
      } catch (err) {}
      setAmbientOsc(null);
      setAmbientGain(null);
      setIsAudioPlaying(false);
    } else {
      // Initialize Context
      const ctx = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioContext) setAudioContext(ctx);

      // Create low visionary space hum/drone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime); // A2 deep space note
      gain.gain.setValueAtTime(0.06, ctx.currentTime);   // Very soft background hum

      // Gentle filter to keep it extremely safe and ambient
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      setAmbientOsc(osc);
      setAmbientGain(gain);
      setIsAudioPlaying(true);
    }
  };

  const playSynthesizedPing = (frequency: number, duration: number) => {
    try {
      const ctx = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioContext) setAudioContext(ctx);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // Standalone HTML template rendering generator
  const getSingleFileHTMLCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <!-- Tailwind CSS & Google Fonts -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Orbitron:wght@500;700&family=Syne:wght@700&family=Plus+Jakarta+Sans:wght@400;600&family=Fraunces:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: ${page.colorPalette.background};
      color: #ffffff;
    }
    .text-gradient {
      background: linear-gradient(to right, ${page.colorPalette.primary}, ${page.colorPalette.secondary});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  </style>
</head>
<body class="min-h-screen relative overflow-x-hidden antialiased">
  
  <!-- Content Container -->
  <div class="max-w-6xl mx-auto px-8 py-12 relative z-10 space-y-24">
    <!-- Header -->
    <header class="flex justify-between items-center py-6">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full" style="background-color: ${page.colorPalette.primary}"></div>
        <span class="font-bold text-lg uppercase tracking-wider">${page.title}</span>
      </div>
      <div>
        <span class="px-3 py-1.5 rounded-full border border-white/10 text-xs bg-white/5" style="color: ${page.colorPalette.primary}">
          ${page.tone}
        </span>
      </div>
    </header>

    <!-- Hero -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-10">
      <div class="md:col-span-8 space-y-6">
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight leading-none">
          ${page.heroHeading} <span class="text-gradient">${page.heroHighlight}</span>
        </h1>
        <p class="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl">
          ${page.heroDescription}
        </p>
        <div class="flex gap-4">
          <a href="#" style="background-color: ${page.colorPalette.primary}; color: #000;" class="px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-95 transition-all">
            ${page.ctaPrimaryLabel}
          </a>
          <a href="#" class="px-8 py-3.5 rounded-full border border-white/20 hover:bg-white/10 transition-all text-sm">
            ${page.ctaSecondaryLabel}
          </a>
        </div>
      </div>
    </section>

    <!-- Features Bento -->
    <section class="space-y-12">
      <h2 class="text-3xl font-bold text-center">Core Pillars</h2>
      <div class="grid grid-cols-1 md:grid-cols-${Math.min(3, page.features.length)} gap-6">
        ${page.features.map((f, i) => `
        <div style="background-color: ${page.colorPalette.tertiary}; border-color: ${page.colorPalette.primary}20" class="rounded-3xl p-6 border flex flex-col justify-between min-h-[220px]">
          <div class="space-y-4">
            <span class="text-xs font-mono uppercase tracking-widest" style="color: ${page.colorPalette.primary}">${f.metaLabel || `0${i + 1} / BLOCK`}</span>
            <h3 class="font-bold text-xl">${f.title}</h3>
            <p class="text-sm text-gray-400 font-mono">${f.subtitle}</p>
            <p class="text-xs text-gray-300 leading-relaxed">${f.description}</p>
          </div>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- Testimonial -->
    <section class="rounded-3xl p-10 border border-white/10" style="background-color: ${page.colorPalette.tertiary}">
      <p class="text-2xl md:text-3xl italic font-semibold leading-relaxed">
        "${page.testimonial.quote}"
      </p>
      <div class="mt-6 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
          ${page.testimonial.author.charAt(0)}
        </div>
        <div>
          <h5 class="text-sm font-semibold">${page.testimonial.author}</h5>
          <p class="text-xs text-gray-400">VERIFIED AURA SYSTEM</p>
        </div>
      </div>
    </section>
  </div>
</body>
</html>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getSingleFileHTMLCode());
    setCopiedCode(true);
    playSynthesizedPing(1000, 0.2);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <>
      <aside className="h-[calc(100vh-80px)] w-full md:w-80 fixed right-0 top-20 z-40 bg-[#131b2e]/90 backdrop-blur-2xl border-l border-[#4cd7f6]/20 shadow-2xl flex flex-col overflow-hidden select-none">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-[#d0bcff]/15 bg-[#131b2e]/50 shrink-0">
          <h2 className="font-display text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span>Designer Console</span>
            <Edit3 className="text-[#4cd7f6]" size={15} />
          </h2>
          <p className="font-mono text-[10px] text-[#cbc3d7]/80">Project Workspace: {activeProject.name}</p>

          {/* Expanded Tab Swapper for All Premium Controls */}
          <div className="flex bg-[#0b1326]/80 p-1 rounded-xl mt-4 border border-[#d0bcff]/10 gap-0.5">
            <button
              onClick={() => { setActiveTab('ai'); playSynthesizedPing(700, 0.05); }}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-medium flex items-center justify-center gap-1 transition-all ${
                activeTab === 'ai' ? 'bg-[#03b5d3] text-[#001f26] font-bold shadow' : 'text-[#cbc3d7] hover:text-[#4cd7f6]'
              }`}
              id="tab_sidebar_ai"
            >
              <Wand2 size={11} />
              <span>AI</span>
            </button>
            <button
              onClick={() => { setActiveTab('aesthetics'); playSynthesizedPing(750, 0.05); }}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-medium flex items-center justify-center gap-1 transition-all ${
                activeTab === 'aesthetics' ? 'bg-[#03b5d3] text-[#001f26] font-bold shadow' : 'text-[#cbc3d7] hover:text-[#4cd7f6]'
              }`}
              id="tab_sidebar_theme"
            >
              <Palette size={11} />
              <span>Theme</span>
            </button>
            <button
              onClick={() => { setActiveTab('content'); playSynthesizedPing(800, 0.05); }}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-medium flex items-center justify-center gap-1 transition-all ${
                activeTab === 'content' ? 'bg-[#03b5d3] text-[#001f26] font-bold shadow' : 'text-[#cbc3d7] hover:text-[#4cd7f6]'
              }`}
              id="tab_sidebar_content"
            >
              <Text size={11} />
              <span>Content</span>
            </button>
            <button
              onClick={() => { setActiveTab('more'); playSynthesizedPing(850, 0.05); }}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-medium flex items-center justify-center gap-1 transition-all ${
                activeTab === 'more' ? 'bg-[#03b5d3] text-[#001f26] font-bold shadow' : 'text-[#cbc3d7] hover:text-[#4cd7f6]'
              }`}
              id="tab_sidebar_more"
            >
              <Sparkles size={11} />
              <span>More</span>
            </button>
          </div>
        </div>

        {/* Editor panels container */}
        <div className="flex-grow overflow-y-auto p-5 space-y-5 scrollbar-thin">
          
          {/* AI REFINEMENT CO-PILOT TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#2d3449]/20 border border-[#4cd7f6]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#4cd7f6]/5 rounded-full blur-xl pointer-events-none" />
                
                <span className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-wider font-semibold block mb-2">Refinement Assist</span>
                <h3 className="font-display text-xs font-semibold text-white mb-2 leading-snug">Type natural language commands to instantly re-theme, rewrite, or redesign.</h3>
                
                <form onSubmit={handleRefinementSubmit} className="space-y-3">
                  <textarea
                    value={commandText}
                    onChange={(e) => setCommandText(e.target.value)}
                    placeholder="e.g. Change title to 'Ethereal Cyber' and make primary colors neon blue..."
                    className="w-full bg-[#0b1326]/80 text-white placeholder-[#cbc3d7]/50 border border-[#d0bcff]/20 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#4cd7f6] resize-none min-h-[90px] leading-relaxed"
                    id="textarea_ai_refine_command"
                    disabled={isRefining}
                  />
                  
                  {refineError && (
                    <p className="text-rose-400 text-[10px] font-mono leading-tight">{refineError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isRefining || !commandText.trim()}
                    className="w-full py-2 bg-[#03b5d3] hover:bg-[#03b5d3]/90 disabled:bg-[#03b5d3]/20 text-[#001f26] disabled:text-[#cbc3d7]/40 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    id="btn_ai_refinement_submit"
                  >
                    {isRefining ? (
                      <>
                        <RefreshCw className="animate-spin text-current" size={13} />
                        <span>Applying Magic...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 size={13} />
                        <span>Refine with AI</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Smart predefined suggestions */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-[#958ea0] uppercase tracking-widest block">Try these instruction commands</span>
                {[
                  "Change theme colors to deep space neon pink and cyan",
                  "Make heading 'Expedition to Mars' with astronomical description",
                  "Set primary button text to 'Launch Rocket' and make icons rocket-themed",
                  "Make the motion super static (0% motion) with visionary layout"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isRefining) {
                        setCommandText(suggestion);
                        playSynthesizedPing(600, 0.05);
                      }
                    }}
                    className="w-full p-2.5 rounded-lg text-left text-[11px] text-[#cbc3d7] bg-[#0b1326]/40 hover:bg-[#0b1326]/80 hover:text-[#4cd7f6] border border-transparent hover:border-[#4cd7f6]/10 transition-all font-sans leading-relaxed block"
                    type="button"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AESTHETICS & PALETTE OVERRIDES TAB */}
          {activeTab === 'aesthetics' && (
            <div className="space-y-4">
              
              {/* Motion Intensity slider */}
              <div className="p-4 rounded-xl bg-[#2d3449]/30 border border-[#d0bcff]/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold">Motion Intensity</span>
                  <Sparkles className="text-[#4cd7f6] fill-[#4cd7f6]/10" size={15} />
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={page.motionIntensity}
                  onChange={(e) => {
                    onUpdateParams({ motionIntensity: parseInt(e.target.value) });
                    playSynthesizedPing(300 + parseInt(e.target.value) * 5, 0.04);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#4cd7f6] outline-none"
                  id="slider_motion_intensity"
                />
                <div className="flex justify-between mt-2 font-mono text-[9px] uppercase tracking-widest text-[#958ea0]">
                  <span>Static</span>
                  <span>Chaos ({page.motionIntensity}%)</span>
                </div>
              </div>

              {/* Font Pairing list */}
              <div className="p-4 rounded-xl bg-[#2d3449]/30 border border-[#d0bcff]/10">
                <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold block mb-3">Typography Pairing</span>
                <select
                  value={page.fontPairing || "Sora & Hanken"}
                  onChange={(e) => {
                    onUpdateParams({ fontPairing: e.target.value as any });
                    playSynthesizedPing(800, 0.1);
                  }}
                  className="w-full bg-[#0b1326] text-white rounded-lg border border-[#d0bcff]/20 px-3 py-2 text-xs focus:ring-1 focus:ring-[#4cd7f6] outline-none"
                  id="select_font_pairing"
                >
                  {fontPairingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Theme Tone selection */}
              <div className="p-4 rounded-xl bg-[#2d3449]/30 border border-[#d0bcff]/10">
                <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold block mb-3">Atmosphere Mode</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { onUpdateParams({ tone: 'Visionary' }); playSynthesizedPing(900, 0.08); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      page.tone === 'Visionary' ? 'bg-[#d0bcff]/15 border-[#4cd7f6] text-white' : 'bg-[#0b1326]/40 border-transparent text-[#cbc3d7] hover:bg-[#0b1326]'
                    }`}
                  >
                    Visionary
                  </button>
                  <button
                    onClick={() => { onUpdateParams({ tone: 'Corporate' }); playSynthesizedPing(850, 0.08); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      page.tone === 'Corporate' ? 'bg-[#d0bcff]/15 border-[#4cd7f6] text-white' : 'bg-[#0b1326]/40 border-transparent text-[#cbc3d7] hover:bg-[#0b1326]'
                    }`}
                  >
                    Corporate
                  </button>
                </div>
              </div>

              {/* Color Preset Palette list */}
              <div className="p-4 rounded-xl bg-[#2d3449]/30 border border-[#d0bcff]/10">
                <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold block mb-3">Select Design Preset</span>
                <div className="grid grid-cols-2 gap-2">
                  {presetPalettes.map((preset) => {
                    const isSelected = page.colorPalette.primary === preset.primary;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => {
                          onUpdateParams({ colorPalette: preset });
                          playSynthesizedPing(750, 0.1);
                        }}
                        className={`p-2.5 rounded-lg flex items-center justify-between border transition-all ${
                          isSelected ? 'bg-[#d0bcff]/15 border-[#4cd7f6] shadow-sm' : 'bg-[#0b1326]/40 border-transparent hover:border-slate-700/60'
                        }`}
                      >
                        <span className="font-sans text-xs text-white">{preset.name}</span>
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom continuous HEX color pickers */}
              <div className="p-4 rounded-xl bg-[#2d3449]/30 border border-[#d0bcff]/10 space-y-3.5">
                <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold block">Advanced Palette Overrides</span>
                
                {/* Primary Picker */}
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-white flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: page.colorPalette.primary }}></div>
                    Primary Color (Glow)
                  </span>
                  <input
                    type="color"
                    value={page.colorPalette.primary}
                    onChange={(e) => {
                      onUpdateParams({
                        colorPalette: { ...page.colorPalette, primary: e.target.value }
                      });
                    }}
                    className="w-8 h-6 bg-transparent cursor-pointer rounded border-0"
                  />
                </div>

                {/* Secondary Picker */}
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-white flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: page.colorPalette.secondary }}></div>
                    Secondary Color (Aura)
                  </span>
                  <input
                    type="color"
                    value={page.colorPalette.secondary}
                    onChange={(e) => {
                      onUpdateParams({
                        colorPalette: { ...page.colorPalette, secondary: e.target.value }
                      });
                    }}
                    className="w-8 h-6 bg-transparent cursor-pointer rounded border-0"
                  />
                </div>

                {/* Background Picker */}
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-white flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: page.colorPalette.background }}></div>
                    Backdrop Color (Midnight)
                  </span>
                  <input
                    type="color"
                    value={page.colorPalette.background}
                    onChange={(e) => {
                      onUpdateParams({
                        colorPalette: { ...page.colorPalette, background: e.target.value }
                      });
                    }}
                    className="w-8 h-6 bg-transparent cursor-pointer rounded border-0"
                  />
                </div>
              </div>

            </div>
          )}

          {/* DYNAMIC CONTENT MODIFICATION TAB */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-wider">Brand Name</label>
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => onUpdateParams({ title: e.target.value })}
                  className="w-full bg-[#0b1326]/60 border border-[#d0bcff]/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4cd7f6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-wider">Hero Headline</label>
                <input
                  type="text"
                  value={page.heroHeading}
                  onChange={(e) => onUpdateParams({ heroHeading: e.target.value })}
                  className="w-full bg-[#0b1326]/60 border border-[#d0bcff]/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4cd7f6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-wider">Glowing Highlight Word</label>
                <input
                  type="text"
                  value={page.heroHighlight}
                  onChange={(e) => onUpdateParams({ heroHighlight: e.target.value })}
                  className="w-full bg-[#0b1326]/60 border border-[#d0bcff]/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4cd7f6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-wider">Hero Description Story</label>
                <textarea
                  value={page.heroDescription}
                  onChange={(e) => onUpdateParams({ heroDescription: e.target.value })}
                  rows={2}
                  className="w-full bg-[#0b1326]/60 border border-[#d0bcff]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4cd7f6] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-wider">Primary Button Text</label>
                <input
                  type="text"
                  value={page.ctaPrimaryLabel}
                  onChange={(e) => onUpdateParams({ ctaPrimaryLabel: e.target.value })}
                  className="w-full bg-[#0b1326]/60 border border-[#d0bcff]/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4cd7f6]"
                />
              </div>

              {/* Bento cards section */}
              <div className="space-y-2 border-t border-[#d0bcff]/15 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-wider block">Bento Grid Boxes ({page.features.length})</span>
                  <button
                    onClick={handleAddFeature}
                    type="button"
                    className="p-1.5 text-xs text-white bg-[#03b5d3]/20 hover:bg-[#03b5d3]/40 border border-[#03b5d3]/40 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span className="font-mono text-[10px]">Add block</span>
                  </button>
                </div>
                
                {page.features.map((feature, fIndex) => {
                  const isExpanded = expandedFeature === fIndex;
                  return (
                    <div key={fIndex} className="bg-[#2d3449]/20 rounded-xl border border-[#d0bcff]/10 overflow-hidden">
                      <div className="w-full p-2.5 font-mono text-xs text-white flex justify-between items-center bg-[#2d3449]/10">
                        <button
                          onClick={() => { setExpandedFeature(isExpanded ? null : fIndex); playSynthesizedPing(650, 0.05); }}
                          className="flex-1 text-left truncate cursor-pointer font-sans"
                          type="button"
                        >
                          Feature {fIndex + 1}: {feature.title || "Untitled"}
                        </button>
                        
                        <button
                          onClick={(e) => handleDeleteFeature(fIndex, e)}
                          title="Delete Bento block"
                          type="button"
                          className="p-1 rounded text-slate-400 hover:text-red-400 font-sans hover:bg-red-500/10 transition-colors ml-2"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="p-3 bg-[#0b1326]/50 border-t border-[#d0bcff]/10 space-y-2.5">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-[#cbc3d7]">Tracking Label</label>
                            <input
                              type="text"
                              value={feature.metaLabel || ""}
                              onChange={(e) => handleFeatureUpdate(fIndex, { metaLabel: e.target.value })}
                              className="w-full bg-[#0b1326]/70 border border-[#d0bcff]/20 rounded-lg px-2 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-[#cbc3d7]">Title</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => handleFeatureUpdate(fIndex, { title: e.target.value })}
                              className="w-full bg-[#0b1326]/70 border border-[#d0bcff]/20 rounded-lg px-2 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-[#cbc3d7]">Subtitle</label>
                            <input
                              type="text"
                              value={feature.subtitle}
                              onChange={(e) => handleFeatureUpdate(fIndex, { subtitle: e.target.value })}
                              className="w-full bg-[#0b1326]/70 border border-[#d0bcff]/20 rounded-lg px-2 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-[#cbc3d7]">Description</label>
                            <textarea
                              value={feature.description}
                              onChange={(e) => handleFeatureUpdate(fIndex, { description: e.target.value })}
                              rows={2}
                              className="w-full bg-[#0b1326]/70 border border-[#d0bcff]/20 rounded-lg px-2 text-xs text-white focus:outline-none resize-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-[#cbc3d7]">Lucide Icon</label>
                            <select
                              value={feature.icon}
                              onChange={(e) => handleFeatureUpdate(fIndex, { icon: e.target.value })}
                              className="w-full bg-[#0b1326] border border-[#d0bcff]/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                            >
                              {["Cpu", "Zap", "Sparkles", "Rocket", "Activity", "Timer", "Flower", "Flame", "Shield", "LineChart", "Terminal"].map(ico => (
                                <option key={ico} value={ico}>{ico}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* MORE TAB: SOUNDS, EXPORTS, AND SNAPSHOT HISTORY */}
          {activeTab === 'more' && (
            <div className="space-y-4">
              
              {/* Standalone Synthesizer Audio Component */}
              <div className="p-4 rounded-xl bg-[#2d3449]/30 border border-[#d0bcff]/10 space-y-3">
                <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold block">Cosmic Sound Engine</span>
                <p className="text-[10px] text-[#cbc3d7]/80 leading-relaxed font-sans">
                  Harnesses pure Web Audio sine wave oscillators to produce deep ambient focus background drones.
                </p>

                <button 
                  onClick={toggleSoundscape}
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAudioPlaying ? 'bg-[#ff3e6c] text-white' : 'bg-[#03b5d3]/20 border border-[#03b5d3]/60 text-[#4cd7f6]'
                  }`}
                >
                  {isAudioPlaying ? (
                    <>
                      <VolumeX size={14} />
                      <span>Stop Space Drone</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} />
                      <span>Start Space Drone</span>
                    </>
                  )}
                </button>
              </div>

              {/* Revision History Checklist */}
              <div className="p-4 rounded-xl bg-[#2d3449]/30 border border-[#d0bcff]/10 space-y-3">
                <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold flex items-center gap-2">
                  <History size={13} />
                  <span>Revision Milestones</span>
                </span>
                
                <p className="text-[10px] text-[#cbc3d7]/80 font-sans">Click on any past design draft to instantly roll the viewport state backward.</p>

                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {historyCheckpoints.map((historicalPage, hIndex) => (
                    <button
                      key={hIndex}
                      onClick={() => {
                        onUpdateParams(historicalPage);
                        playSynthesizedPing(600 + hIndex * 50, 0.1);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-[#0b1326]/60 border border-white/5 hover:border-[#4cd7f6]/40 text-[10px] font-mono hover:text-[#4cd7f6] transition-all flex justify-between items-center"
                      type="button"
                    >
                      <span>Draft revision #{hIndex + 1}</span>
                      <span className="text-[8px] text-[#958ea0] tracking-tighter shrink-0 ml-1">Restore</span>
                    </button>
                  ))}
                  {historyCheckpoints.length === 0 && (
                    <p className="text-[#958ea0] text-[10px] font-mono py-2 text-center">Modify any parameter to commit draft revisions.</p>
                  )}
                </div>
              </div>

              {/* Code Export Tool block */}
              <div className="p-4 rounded-xl bg-[#2d3449]/30 border border-[#d0bcff]/10 space-y-3">
                <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold block">Export Pipeline</span>
                <p className="text-[10px] text-[#cbc3d7]/80 font-sans leading-relaxed">Copies single-file fully packaged HTML containing Tailwind CSS styles dynamically synced!</p>
                
                <button
                  onClick={() => { setShowCodeModal(true); playSynthesizedPing(1000, 0.1); }}
                  type="button"
                  className="w-full py-2 bg-gradient-to-r from-[#d0bcff]/20 to-[#acedff]/20 hover:from-[#d0bcff]/30 hover:to-[#acedff]/30 text-white border border-[#4cd7f6]/30 text-xs font-mono font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Code size={13} />
                  <span>Interactive HTML Code</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Regenerate Button */}
        <div className="p-4 border-t border-[#494454]/30 bg-[#131b2e]/60 shrink-0">
          <button 
            onClick={() => { onGenerateNewDraft(); playSynthesizedPing(1100, 0.25); }}
            className="w-full py-2.5 bg-[#03b5d3] hover:bg-[#03b5d3]/90 text-[#001f26] rounded-xl shadow-[0_0_12px_rgba(3,181,211,0.35)] font-mono text-xs font-semibold uppercase tracking-wider hover:scale-[1.01] active:scale-95 transition-all"
            id="btn_refinement_regenerate_draft"
          >
            Regenerate Layout
          </button>
        </div>

      </aside>

      {/* Standalone Interactive Code Viewer Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-lg z-50 flex items-center justify-center p-6 select-none">
          <div className="bg-[#131b2e] border border-[#4cd7f6]/30 max-w-2xl w-full rounded-3xl p-6 relative flex flex-col max-h-[85vh] shadow-2xl animate-fade-in">
            <h3 className="font-display text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="text-[#4cd7f6]" size={18} />
              <span>Standalone HTML Exporter</span>
            </h3>
            
            <p className="text-xs text-[#cbc3d7]/80 pb-3 leading-relaxed">
              Copy this compiled package block. It is a completely autonomous HTML landing page ready to fly in production or web hosting clusters!
            </p>

            <div className="flex-1 overflow-y-auto bg-black/45 rounded-xl border border-white/5 p-4 font-mono text-[10px] text-[#cbc3d7] scrollbar-thin max-h-[50vh] leading-relaxed whitespace-pre select-text selection:bg-[#4cd7f6]/40 selector-code">
              {getSingleFileHTMLCode()}
            </div>

            <div className="flex gap-3 mt-5 shrink-0">
              <button
                onClick={handleCopyCode}
                className="flex-1 py-2.5 bg-[#03b5d3] hover:bg-[#4cd7f6] text-[#001f26] text-xs font-mono font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check size={14} />
                    <span>Copied Code Package!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold uppercase rounded-xl transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default RefinementSidebar;

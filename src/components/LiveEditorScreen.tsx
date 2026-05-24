import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Monitor, Tablet, Smartphone, Image, Sparkles } from 'lucide-react';

interface LogItem {
  timestamp: string;
  text: string;
  type?: "info" | "success" | "magic";
}

interface LiveEditorScreenProps {
  logs: LogItem[];
  isGenerating?: boolean;
  onPreviewClick?: () => void;
  brandName?: string;
  onAddLogSimulated?: (text: string, type?: "info" | "success" | "magic") => void;
}

export const LiveEditorScreen: React.FC<LiveEditorScreenProps> = ({
  logs,
  isGenerating = false,
  onPreviewClick,
  brandName = "Project Alpha",
  onAddLogSimulated
}) => {
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the logs container
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Handle active device mockup width styling
  const getDeviceWidth = () => {
    switch (activeDevice) {
      case 'mobile':
        return 'max-w-xs';
      case 'tablet':
        return 'max-w-xl';
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <div className="w-full h-[calc(100vh-140px)] flex overflow-hidden border border-[#d0bcff]/15 rounded-2xl bg-[#060e20]/60 backdrop-blur-md">
      
      {/* Left panel: System Logs */}
      <section className="w-80 border-r border-[#d0bcff]/15 flex flex-col bg-[#131b2e]/40 shrink-0">
        <div className="p-4 border-b border-[#d0bcff]/10 bg-[#d0bcff]/5 flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <Terminal className="text-[#4cd7f6]" size={16} />
            <h3 className="font-mono text-xs font-semibold text-[#4cd7f6] uppercase tracking-widest">System Logs</h3>
          </div>
          {isGenerating && (
            <div className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping" />
          )}
        </div>

        {/* Logs Stream scrollable box */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-[11px] leading-relaxed text-[#cbc3d7]/90 scrollbar-thin">
          {logs.map((log, index) => {
            let color = "text-[#cbc3d7]";
            if (log.type === "success") color = "text-[#4cd7f6]";
            if (log.type === "magic") color = "text-[#d0bcff] italic font-medium";

            return (
              <div key={index} className="flex gap-2.5 items-start animate-fade-in">
                <span className="text-[#958ea0] shrink-0">{log.timestamp}</span>
                {log.type === "magic" && (
                  <span className="w-1.5 h-1.5 bg-[#d0bcff] rounded-full mt-1.5 animate-pulse shrink-0" />
                )}
                <p className={`${color} break-words`}>{log.text}</p>
              </div>
            );
          })}
          <div ref={logEndRef} />
        </div>
      </section>

      {/* Main Canvas Workspace */}
      <section className="flex-1 canvas-grid bg-[#060e20] overflow-hidden flex flex-col justify-between relative p-6">
        
        {/* Scanning telemetry line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="scan-line w-full h-[2px] bg-gradient-to-r from-transparent via-[#4cd7f6]/40 to-transparent absolute top-0 left-0 animate-pulse" />
        </div>

        {/* Outer glowing decor blurs */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#d0bcff]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#4cd7f6]/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Mockup Frame Header switches */}
        <div className="w-full flex justify-between items-center mb-4 z-10 shrink-0">
          <span className="text-[#cbc3d7] font-sans text-xs">Wireframe Editor view</span>
          
          {/* Preview switch buttons */}
          {onPreviewClick && (
            <button 
              onClick={onPreviewClick}
              className="bg-[#03b5d3]/10 hover:bg-[#03b5d3]/20 border border-[#03b5d3]/30 text-[#4cd7f6] px-4 py-1.5 rounded-full font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              id="editor_btn_view_live_rendered"
            >
              <Sparkles size={11} className="fill-[#4cd7f6]" />
              <span>Launch Live Preview</span>
            </button>
          )}
        </div>

        {/* Wireframe Canvas Shell Mockup */}
        <div className={`w-full ${getDeviceWidth()} h-full bg-[#131b2e]/60 border border-[#d0bcff]/20 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col mx-auto transition-all duration-300`}>
          
          {/* Mock Browser Title bar */}
          <div className="h-12 border-b border-[#d0bcff]/15 flex items-center justify-between px-4 bg-[#222a3d]/40 select-none">
            
            {/* 3 windows mock dots */}
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffb4ab]/40"></div>
              <div className="w-3 h-3 rounded-full bg-[#4cd7f6]/40"></div>
              <div className="w-3 h-3 rounded-full bg-[#d0bcff]/40"></div>
            </div>

            {/* Address field */}
            <div className="bg-[#0b1326]/60 rounded-md px-4 py-1 border border-[#494454]/30 font-mono text-[10px] text-[#958ea0] select-none text-center">
              waterflow.ai/draft/{brandName.toLowerCase().replace(/\s+/g, '-')}
            </div>

            {/* View selectors */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveDevice('desktop')}
                className={`p-1 rounded hover:bg-slate-700/30 transition-colors ${activeDevice === 'desktop' ? 'text-[#4cd7f6]' : 'text-[#cbc3d7]/60'}`}
                title="Desktop"
                id="btn_wireframe_desktop"
              >
                <Monitor size={14} />
              </button>
              <button 
                onClick={() => setActiveDevice('tablet')}
                className={`p-1 rounded hover:bg-slate-700/30 transition-colors ${activeDevice === 'tablet' ? 'text-[#4cd7f6]' : 'text-[#cbc3d7]/60'}`}
                title="Tablet"
                id="btn_wireframe_tablet"
              >
                <Tablet size={14} />
              </button>
              <button 
                onClick={() => setActiveDevice('mobile')}
                className={`p-1 rounded hover:bg-slate-700/30 transition-colors ${activeDevice === 'mobile' ? 'text-[#4cd7f6]' : 'text-[#cbc3d7]/60'}`}
                title="Mobile"
                id="btn_wireframe_mobile"
              >
                <Smartphone size={14} />
              </button>
            </div>

          </div>

          {/* SKELETALS WIREFRAME INNER CONTENT */}
          <div className="flex-1 p-8 overflow-y-auto space-y-10 scrollbar-thin">
            
            {/* Skeletal Section 1: Hero */}
            <div className="space-y-6 relative p-3 border border-dashed border-[#4cd7f6]/20 rounded-xl">
              <div className="absolute -top-3 left-3 bg-[#131b2e] px-2 text-[9px] text-[#4cd7f6] font-mono border border-[#4cd7f6]/30 rounded uppercase tracking-wider">
                AI: Section_Hero
              </div>

              <div className="max-w-md space-y-3 pt-2">
                <div className="h-4 w-1/3 bg-[#4cd7f6]/10 rounded border border-[#4cd7f6]/20"></div>
                
                {/* Big headings skeletals */}
                <div className="space-y-2">
                  <div className="h-8 w-5/6 bg-slate-700/20 rounded shimmer"></div>
                  <div className="h-8 w-2/3 bg-slate-700/45 rounded shim-accent"></div>
                </div>

                <div className="h-3 w-full bg-slate-800/40 rounded mt-4"></div>
                <div className="h-3 w-4/5 bg-slate-800/40 rounded"></div>

                <div className="flex gap-3 pt-2">
                  <div className="h-10 w-28 bg-[#d0bcff]/20 border border-[#d0bcff]/30 rounded-full shimmer"></div>
                  <div className="h-10 w-28 border border-[#958ea0]/40 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Skeletal Section 2: Features Bento */}
            <div className="grid grid-cols-12 gap-5 relative p-3 border border-dashed border-[#d0bcff]/20 rounded-xl">
              <div className="absolute -top-3 left-3 bg-[#131b2e] px-2 text-[9px] text-[#d0bcff] font-mono border border-[#d0bcff]/35 rounded uppercase tracking-wider">
                AI: Section_Features_Grid
              </div>

              <div className="col-span-8 h-44 bg-[#131b2e]/60 rounded-xl border border-white/5 flex flex-col p-5 gap-3 pt-5">
                <div className="w-8 h-8 rounded bg-[#8e8bc2]/20 flex items-center justify-center border border-white/5">
                  <Image size={14} className="text-[#8e8bc2]/60" />
                </div>
                <div className="h-4 w-1/4 bg-slate-700/20 rounded"></div>
                <div className="space-y-1.5 mt-2">
                  <div className="h-2 w-full bg-slate-800/40 rounded"></div>
                  <div className="h-2 w-5/6 bg-slate-800/40 rounded"></div>
                </div>
              </div>

              <div className="col-span-4 h-44 bg-[#03b5d3]/5 border-2 border-dashed border-[#03b5d3]/20 rounded-xl flex items-center justify-center p-4">
                <div className="w-full h-full border border-dashed border-[#4cd7f6]/20 rounded-lg bg-[#060e20]/45 flex items-center justify-center">
                  <Image size={24} className="text-[#4cd7f6]/40" />
                </div>
              </div>
            </div>

          </div>

          {/* Float Bot Tooltip Popover */}
          <div className="absolute bottom-6 right-6 select-none animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="glass-panel p-3.5 rounded-2xl border border-[#4cd7f6]/30 shadow-2xl flex items-center gap-3 max-w-xs">
              <div className="w-8 h-8 rounded-full bg-[#4cd7f6] flex items-center justify-center shrink-0">
                <Sparkles className="text-[#001f26] fill-[#001f26]" size={15} />
              </div>
              <p className="text-[11px] font-sans text-white leading-normal">
                "I'm refining the typography scale for better readability. Would you like to see a variation with more cosmic gradients?"
              </p>
            </div>
          </div>

        </div>

        {/* Footer info inside canvas */}
        <div className="w-full text-center text-[10px] text-[#958ea0]/75 font-mono select-none pt-2 shrink-0">
          * Dynamic logging streams in real-time. Match components dynamically.
        </div>

      </section>
    </div>
  );
};
export default LiveEditorScreen;

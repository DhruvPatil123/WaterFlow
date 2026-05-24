import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSetTab: (tab: any) => void;
  onNewProject: () => void;
  liveViewActive?: boolean;
  onShowToast?: (message: string, type?: "success" | "info" | "warning") => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSetTab,
  onNewProject,
  liveViewActive = false,
  onShowToast
}) => {
  return (
    <header className="w-full sticky top-0 z-50 bg-[#090b11]/80 backdrop-blur-2xl border-b border-[#ffffff]/08 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center px-8 py-4.5 max-w-7xl mx-auto">
        
        {/* Left Brand and Links */}
        <div className="flex items-center gap-10">
          <h1 
            onClick={() => onSetTab('Dashboard')}
            className="font-display text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#6366f1] to-[#ec4899] animate-text-shimmer cursor-pointer hover:opacity-90 select-none flex items-center gap-2"
            id="brand_title_primary"
          >
            <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 inline-block shadow-[0_0_15px_rgba(168,85,247,0.4)]"></span>
            <span>WaterFlow</span>
          </h1>
          <nav className="hidden md:flex items-center gap-8 text-sm font-sans">
            <button 
              onClick={() => onSetTab('Dashboard')}
              className={`pb-1 transition-all duration-200 ${
                currentTab === 'Dashboard' 
                  ? 'text-purple-400 border-b-2 border-purple-500 font-semibold' 
                  : 'text-[#94a3b8] hover:text-white transition-colors'
              }`}
              id="hdr_nav_dash"
            >
              Dashboard
            </button>
            <button 
              onClick={() => onSetTab('Generator')}
              className={`pb-1 transition-all duration-200 ${
                currentTab === 'Generator'
                  ? 'text-purple-400 border-b-2 border-purple-500 font-semibold'
                  : 'text-[#94a3b8] hover:text-white transition-colors'
              }`}
              id="hdr_nav_gen"
            >
              Templates
            </button>
            <button 
              onClick={() => onShowToast ? onShowToast("Showcase features coming soon!", "info") : alert("Showcase features coming soon!")}
              className="text-[#94a3b8] hover:text-white transition-colors pb-1"
              id="hdr_nav_showcase"
            >
              Showcase
            </button>
            <button 
              onClick={() => onShowToast ? onShowToast("WaterFlow Documentation deck loading...", "info") : alert("WaterFlow Documentation deck loading...")}
              className="text-[#94a3b8] hover:text-white transition-colors pb-1"
              id="hdr_nav_docs"
            >
              Docs
            </button>
          </nav>
        </div>

        {/* Right side status & actions */}
        <div className="flex items-center gap-5">
          
          {/* Live Preview Pill Indicator */}
          {liveViewActive && (
            <div className="flex items-center px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">Viewport Active</span>
            </div>
          )}

          <button 
            onClick={onNewProject}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:opacity-95 text-white font-sans text-xs font-bold px-6 py-3 rounded-full flex items-center gap-1.5 shadow-[0_4px_20px_rgba(168,85,247,0.35)] active:scale-95 transition-all duration-200 cursor-pointer"
            id="hdr_btn_new_project"
          >
            <Plus size={14} className="stroke-[3]" />
            <span>New Space</span>
          </button>

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-md">
            <img 
              alt="User profile avatar" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGy0XCIyktrdCK-4gqDvOxyXrQGXyoDU_MVvGcwhygRXCYMXIpIGUZm4coX6kv7_65vRBMwzniENvzHle83ztiQehRp0IhfOB_uRYXtOpDNhGznbVLTt2BV7w5A7dZa-kH0gkFWL3LocY-Uh-5PIJSP6zfPyy9d8TunuDjguawxtwZBvVLS_GZoqqtkNvfI8qh4e8GP_qvG59GFXsseRCsXIuVWSJb6mVZY9qMo3l08wUPN4wF7X2eCFxgM32RfmYUJLVzDe4teGM"
            />
          </div>
        </div>
        
      </div>
    </header>
  );
};
export default Header;

import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  FolderOpen, 
  Settings, 
  HelpCircle, 
  MessageSquare, 
  Layers,
  LayoutGrid
} from 'lucide-react';
import { Project } from '../types';

interface SideNavBarProps {
  currentTab: string;
  onChangeTab: (tab: "Generator" | "Live Editor" | "Logs" | "Assets" | "Settings" | "Dashboard") => void;
  activeProject: Project | null;
  onPublish: () => void;
  onShowToast?: (message: string, type?: "success" | "info" | "warning") => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentTab,
  onChangeTab,
  activeProject,
  onPublish,
  onShowToast
}) => {
  const navItems = [
    { id: 'Generator', label: 'Generator', icon: Sparkles },
    { id: 'Live Editor', label: 'Live Editor', icon: Layers },
    { id: 'Logs', label: 'Logs', icon: Terminal },
    { id: 'Assets', label: 'Assets', icon: FolderOpen },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 bg-[#090a0f]/85 backdrop-blur-2xl border-r border-[#ffffff]/08 shadow-[5px_0_30px_rgba(0,0,0,0.6)] flex flex-col p-5 gap-4 z-40">
      
      {/* Brand Header */}
      <div 
        onClick={() => onChangeTab('Dashboard')}
        className="flex items-center gap-3.5 px-2 py-4 mb-3 cursor-pointer hover:opacity-95 transition-opacity"
        id="side_brand_header"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center border border-white/10 shadow-[0_4px_15px_rgba(139,92,246,0.35)]">
          <Sparkles className="text-white" size={18} />
        </div>
        <div>
          <h2 className="font-display font-semibold text-white tracking-wide text-sm leading-tight max-w-[140px] truncate">
            {activeProject ? activeProject.name : 'Project Alpha'}
          </h2>
          <p className="text-[#a78bfa] font-mono text-[9px] uppercase tracking-widest mt-0.5">
            Ecosystem Core
          </p>
        </div>
      </div>

      {/* Main Tab Links */}
      <div className="flex flex-col gap-1.5 flex-grow font-sans">
        <button
          onClick={() => onChangeTab('Dashboard')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:translate-x-1 font-mono text-xs uppercase tracking-wider ${
            currentTab === 'Dashboard' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)] font-semibold' 
              : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
          }`}
          id="btn_tab_dashboard"
        >
          <LayoutGrid size={16} />
          <span>Dashboard</span>
        </button>

        <div className="h-[1px] bg-gradient-to-r from-white/10 to-transparent my-2" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:translate-x-1 font-mono text-xs uppercase tracking-wider ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)] font-semibold' 
                  : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
              }`}
              id={`btn_tab_${item.id.toLowerCase().replace(' ', '_')}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2 font-sans">
        <button 
          onClick={onPublish}
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:opacity-95 py-3 rounded-xl font-mono text-xs font-bold text-white shadow-[0_4px_25px_rgba(236,72,153,0.35)] active:scale-95 transition-all text-center uppercase tracking-widest cursor-pointer"
          id="btn_publish_now"
        >
          Publish Cloud
        </button>

        <button 
          onClick={() => onShowToast ? onShowToast("Help & Documentation center loading soon...", "info") : alert("Help and Documentation are coming soon to your space.")}
          className="flex items-center gap-3 px-4 py-2 text-[#94a3b8] hover:text-white text-xs font-mono tracking-wide transition-colors"
          id="btn_help"
        >
          <HelpCircle size={14} />
          <span>Help Center</span>
        </button>

        <button 
          onClick={() => onShowToast ? onShowToast("Thank you! Feedback received in cosmic stream.", "success") : alert("Thank you! Feedback received in cosmic stream.")}
          className="flex items-center gap-3 px-4 py-2 text-[#94a3b8] hover:text-white text-xs font-mono tracking-wide transition-colors"
          id="btn_feedback"
        >
          <MessageSquare size={14} />
          <span>Feedback</span>
        </button>
      </div>
    </nav>
  );
};

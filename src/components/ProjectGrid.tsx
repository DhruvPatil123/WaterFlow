import React from 'react';
import { Project } from '../types';
import { Edit2, BarChart2, PlusCircle } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (id: string, view: "ProjectView" | "Live Editor") => void;
  onInitNewStream: () => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onSelectProject,
  onInitNewStream
}) => {
  // Map tags to aesthetic coloring classes
  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'In Design':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/25';
      case 'Prototype':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/25';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/25';
    }
  };

  // Static images mapping to existing screenshot assets
  const getProjectImage = (name: string) => {
    const term = name.toLowerCase();
    if (term.includes('coffee') || term.includes('luminal')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuCzQyFH6Bl6KbPsiNVSSOmb87w1wrTA2YTrZOSYWiG1Skfyuccpb332UxEoss_9r3x-rjzc8iY6DlOjtEpYXL2dpykq4FpdWX-JR9MEZeFNWFM50GJtseinfsk1PQ7Ei3FE7wBcKNX60TkxBzkKF_GYFXvpV_Kwt3nHMiYRcYOeLqf446-Md6rG2UvToROttbgNSIFRlZRetCBkVs4PUKAzRYklu7DVBgGPTyTqHlxFUQCRxMdfhcZxGXbXhHcMFzmIAZgSLPGuiEg";
    }
    if (term.includes('spacex') || term.includes('clone') || term.includes('space')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuByt1PCtVxOBCHnT47-2AaIoaaZqjX97W_0z8m1tX07bGy6x6F-_5CwxB8owwCwEKIZoHAKUM9ITUl9Yc95AytOZdcuL9-1jbXF2ogc-OCyTST2zNArIBa1znLiHlnireKcoFucfYUTtIgSI4YjRZ8BWK3WXjypzhpy2n611ysCzg2Z0rUCEILkNrVhL5OsUnf1PezJXdEe8ydAEf5RL9BUqNKepWNxoL3mcS6u5AWyVpR0UHQTsvMM8z2AukOnK2HTBQuIOmWO_-E";
    }
    if (term.includes('zen') || term.includes('garden')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuAy7_lmE6V38nkZtnSkdBq4Bu7kVmhRN4HPCRO4DOrHhq-5NrLaUHxbBEJHLt1urIREqaRSLMOzUS92F41Q3I53m0yOrUn10c4DXl-rPOYiljLFLXUNcGd3q7ZhGbld2VsuHBh774cM5nmklswInuS8Ct0cL7rDzwoNO8si1es_D1Ate5teyCSCk6LydT583JgLkNmmuJ6gUlFz4RFtx8VelhBQICME8MTLJO3eK6pSz9SOjxtUxRL0zdFCYElDn7NOxLaEYgnEDCs";
    }
    // Ambient fluid background representation for dynamic pages
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuC5bCbdA7_7sxtza9EwOvkN8GMrwYY5_4Am3y1qV0QvMXREj-8dvOB8uQ__070BHhmtbu44KyW2u4RnWcWemaPmcZyz_Mnd3Z2f8GI1TooOcqsQ-jS9Z4i7lmpU0tH9Vg1IwQ0axvzs7N6vgzE_kEKFKvKP-CjZptpcDPE6Cl02vuWi_Hxuogsh3E8wBJYGVd7RMMGMgBMzvmrvdrMzUMDSqiH7gXAhZYra_haSJralyPWBsG_F61678og91nd9SNYc_Brm5fpSVSU";
  };

  return (
    <div className="w-full">
      {/* Dashboard Section Header */}
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="font-display text-4xl font-black text-white mb-2 tracking-tight" id="project_dashboard_title">
            Creative Hub
          </h2>
          <p className="text-[#94a3b8] max-w-xl text-sm font-sans" id="project_dashboard_subtitle">
            Harness real-time AI synthesis to compile luxurious, high-contrast, beautiful brand pages with custom visual telemetry.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/25 text-[#34d399] font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>Water Synthesis Live</span>
          </span>
        </div>
      </header>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {projects.map((project) => (
          <div 
            key={project.id}
            className="group bg-[#0a0c14]/70 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/30 hover:scale-[1.02] shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)] transition-all duration-300 flex flex-col relative"
            id={`project_card_${project.id}`}
          >
            {/* Visual Thumbnail */}
            <div className="relative h-48 overflow-hidden border-b border-white/5">
              <img 
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                referrerPolicy="no-referrer"
                src={getProjectImage(project.name)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] to-transparent opacity-75"></div>
              
              <div className="absolute top-4 right-4">
                <span className={`backdrop-blur-md text-[9px] font-mono px-2.5 py-1 rounded-full border uppercase tracking-widest font-bold flex items-center gap-1.5 ${getStatusBadge(project.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    project.status === 'Active' ? 'bg-emerald-400' : project.status === 'In Design' ? 'bg-purple-400' : 'bg-amber-400'
                  }`} />
                  {project.status}
                </span>
              </div>
            </div>

            {/* Grid details */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-display font-bold text-xl text-white mb-2 leading-snug">
                {project.name}
              </h3>
              <p className="text-[#94a3b8] font-sans text-xs mb-6 flex-grow leading-relaxed">
                {project.description}
              </p>
              
              {/* Actions split */}
              <div className="flex gap-3 mt-auto font-sans">
                <button 
                  onClick={() => onSelectProject(project.id, 'ProjectView')}
                  className="flex-grow bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-95 text-white py-2.5 rounded-xl font-mono text-xs font-bold shadow-[0_4px_15px_rgba(139,92,246,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id={`btn_quick_edit_${project.id}`}
                >
                  <Edit2 size={13} />
                  <span>Interactive Editor</span>
                </button>
                <button 
                  onClick={() => onSelectProject(project.id, 'Live Editor')}
                  className="px-4 bg-white/[0.04] hover:bg-white/[0.08] text-[#94a3b8] hover:text-white rounded-xl border border-white/5 transition-all flex items-center justify-center cursor-pointer"
                  title="View Live Editor & System Logs"
                  id={`btn_logs_${project.id}`}
                >
                  <BarChart2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Prompt Placeholder */}
        <button 
          onClick={onInitNewStream}
          className="bg-white/[0.01] hover:bg-white/[0.03] rounded-3xl border-2 border-dashed border-white/10 hover:border-purple-500/40 flex flex-col items-center justify-center p-8 group transition-all duration-300 min-h-[400px] cursor-pointer"
          id="btn_initiate_stream_placeholder"
        >
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300 shadow-md">
            <PlusCircle className="text-purple-400" size={30} />
          </div>
          <span className="font-display text-lg text-white font-bold tracking-tight">Initialize Space</span>
          <p className="text-[#94a3b8]/75 text-xs mt-2 font-sans max-w-[200px] text-center">Start with AI-suggested themes and layout presets</p>
        </button>

      </div>
    </div>
  );
};
export default ProjectGrid;

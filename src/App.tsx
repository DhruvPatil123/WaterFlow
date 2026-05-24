import React, { useState, useEffect } from 'react';
import { SideNavBar } from './components/SideNavBar';
import { Header } from './components/Header';
import { ProjectGrid } from './components/ProjectGrid';
import { GeneratorScreen } from './components/GeneratorScreen';
import { LiveEditorScreen } from './components/LiveEditorScreen';
import { LandingPagePreview } from './components/LandingPagePreview';
import { RefinementSidebar } from './components/RefinementSidebar';
import { Project, LandingPage } from './types';
import { 
  Sparkles, 
  Terminal, 
  FileText, 
  Settings as SettingsIcon, 
  CheckCircle,
  HelpCircle,
  Globe,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

const INITIAL_PROJECTS: Project[] = [
  {
    id: "luminal-coffee",
    name: "Luminal Coffee",
    description: "Premium brand experience styled with rich Obsidian Amethyst, fluid velvet gradients, and deep gold details.",
    status: "Active",
    page: {
      id: "luminal-coffee-page",
      title: "Luminal Coffee",
      heroHeading: "Brewing the",
      heroHighlight: "Celestial Origin",
      heroDescription: "Experience single-origin roasting refined in orbital greenhouses. Luminal merges organic molecular flavor with pure technological luxury.",
      ctaPrimaryLabel: "Select Your Roast",
      ctaSecondaryLabel: "Vortex Telemetry",
      colorPalette: {
        primary: "#c084fc",
        secondary: "#ec4899",
        tertiary: "#11121d",
        accent: "#6366f1",
        background: "#07080d"
      },
      features: [
        {
          metaLabel: "01 / ROAST PROFILE",
          title: "Molecular Precision",
          subtitle: "Thermal flow analysis",
          description: "Every batch is dynamically monitored through real-time heat telemetry to extract ultimate sweetness and floral notes.",
          icon: "Cpu"
        },
        {
          metaLabel: "02 / FLAVOR SYNC",
          title: "Aromatic Bloom",
          subtitle: "Optimized pressure curve",
          description: "Our adaptive brewing profile syncs with your biometric aura to create the absolute perfect cup.",
          icon: "Zap"
        },
        {
          metaLabel: "03 / GREENHOUSE LAB",
          title: "Cosmic Sourcing",
          subtitle: "Orbital microclimate gardens",
          description: "Cultivated with lunar solar-arrays to yield unprecedented flavor density and visual botanical wonder.",
          icon: "Sparkles"
        }
      ],
      testimonial: {
        quote: "Luminal coffee completely elevates standard morning routines into a high-fidelity sensory event.",
        author: "Aura Moss",
        stars: 5
      },
      motionIntensity: 60,
      tone: "Visionary"
    }
  },
  {
    id: "spacex-clone",
    name: "SpaceX Clone",
    description: "Futuristic space explorer with responsive vector blocks, high-speed telemetry panels, and beautiful Cyber Mint highlights.",
    status: "In Design",
    page: {
      id: "spacex-clone-page",
      title: "Water Starship",
      heroHeading: "Ascend the",
      heroHighlight: "Uncharted Cosmos",
      heroDescription: "A glorious planetary navigational portal tracking high-velocity orbital transits under meticulous physics constraints.",
      ctaPrimaryLabel: "Begin Ignition",
      ctaSecondaryLabel: "Satellite Stream",
      colorPalette: {
        primary: "#00ffcc",
        secondary: "#3b82f6",
        tertiary: "#09101f",
        accent: "#22c55e",
        background: "#040712"
      },
      features: [
        {
          metaLabel: "01 / PROPULSION SYSTEM",
          title: "Liquid Thermals",
          subtitle: "Real-time vector trust logs",
          description: "Witness smooth aerodynamic acceleration paths and real-time oxygen dilution levels dynamically mapped.",
          icon: "Rocket"
        },
        {
          metaLabel: "02 / SPATIAL VECTOR",
          title: "Dynamic Cooldown",
          subtitle: "Orbital drift compensation",
          description: "Automatic solar-panel orientation adjustments and coordinate matrix streaming calculated seamlessly.",
          icon: "Timer"
        }
      ],
      testimonial: {
        quote: "The interface mapping layout is stunning. Absolute vector clarity paired with neon matrix aesthetics.",
        author: "Commander Star",
        stars: 5
      },
      motionIntensity: 40,
      tone: "Corporate"
    }
  },
  {
    id: "zen-garden",
    name: "Zen Garden",
    description: "A gorgeous wellness layout featuring warm Amber Champagne palettes, calm sand rake systems, and elegant minimalism.",
    status: "Prototype",
    page: {
      id: "zen-garden-page",
      title: "Zen Oasis",
      heroHeading: "Decompress in",
      heroHighlight: "Absolute Calm",
      heroDescription: "A pristine retreat designed to restore psychological balance and physical alignment through sensory soundscapes and clean visuals.",
      ctaPrimaryLabel: "Rake the Stone",
      ctaSecondaryLabel: "Listen Ambient",
      colorPalette: {
        primary: "#f59e0b",
        secondary: "#f43f5e",
        tertiary: "#1a1005",
        accent: "#fcd34d",
        background: "#0a0601"
      },
      features: [
        {
          metaLabel: "01 / MINDFULNESS",
          title: "Symmetric Sand Beds",
          subtitle: "Fluid rake simulations",
          description: "Gently guide your focus paths as falling cherry blossoms touch down on smooth, procedurally flowing patterns.",
          icon: "Flower"
        }
      ],
      testimonial: {
        quote: "An breathtakingly beautiful exercise of elegant spacing and quiet warmth. Unmatched digital relaxation.",
        author: "Water Curator",
        stars: 5
      },
      motionIntensity: 15,
      tone: "Visionary"
    }
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<"Generator" | "Live Editor" | "Logs" | "Assets" | "Settings" | "Dashboard" | "ProjectView">("Dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // Real-time flowing terminal logs
  const [activeProjectLogs, setActiveProjectLogs] = useState<{ timestamp: string; text: string; type?: "info" | "success" | "magic" }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Modern, beautiful non-blocking Toast notifications
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" | "warning" }[]>([]);

  const showToast = (message: string, type: "success" | "info" | "warning" = "info") => {
    const id = `toast-${Date.now()}`;
    setToasts(current => [...current, { id, message, type }]);
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id));
    }, 4000);
  };

  // Load and sync projects from localStorage
  useEffect(() => {
    let saved = localStorage.getItem('waterflow_projects');
    if (!saved) {
      saved = localStorage.getItem('aetherflow_projects');
    }
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProjects(parsed);
        if (parsed.length > 0) {
          setActiveProjectId(parsed[0].id);
        }
      } catch (e) {
        setProjects(INITIAL_PROJECTS);
        setActiveProjectId(INITIAL_PROJECTS[0].id);
      }
    } else {
      setProjects(INITIAL_PROJECTS);
      setActiveProjectId(INITIAL_PROJECTS[0].id);
    }

    // Default initializer log history
    const initialLogs = [
      { timestamp: "14:02:11", text: "WaterFlow initialization complete.", type: "info" as const },
      { timestamp: "14:02:14", text: "Ready to harness fluid designer instructions.", type: "success" as const },
      { timestamp: "10:00:03", text: "Loaded 3 historical project profiles securely.", type: "magic" as const }
    ];
    setActiveProjectLogs(initialLogs);
  }, []);

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem('waterflow_projects', JSON.stringify(updated));
  };

  // Safe getter for active project
  const getActiveProject = (): Project | null => {
    if (!activeProjectId) return null;
    return projects.find(p => p.id === activeProjectId) || null;
  };

  const activeProject = getActiveProject();

  const addLog = (text: string, type?: "info" | "success" | "magic") => {
    const now = new Date();
    const ts = now.toTimeString().split(' ')[0];
    setActiveProjectLogs(prev => [...prev, { timestamp: ts, text, type }]);
  };

  // Full dynamic generation route logic connecting Express API
  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setCurrentTab("Live Editor");
    setActiveProjectLogs([]); // Clear for clean transition scene (Screen 4)

    addLog("Parsing user generative intent...", "info");
    
    // Simulate telemetry streams while querying Express server in background
    let progressIdx = 0;
    const progressLogs = [
      "Translating prompt keywords...",
      "Resolving visual brand tokens...",
      "Injecting layout alignment parameters...",
      "Synthesizing bento configurations...",
      "Aligning typography scale thresholds...",
      "Resolving color palette coordinates...",
      "Compiling final wireframe skeletal modules..."
    ];

    const telemetryTimer = setInterval(() => {
      if (progressIdx < progressLogs.length) {
        addLog(progressLogs[progressIdx], "magic");
        progressIdx++;
      }
    }, 1200);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tone: "Visionary" })
      });

      if (!response.ok) {
        throw new Error("Generative server returned failure.");
      }

      const lPage: LandingPage = await response.json();
      
      clearInterval(telemetryTimer);
      addLog("Generative payload parsed successfully. Resolving structures...", "success");

      // Generate distinct ID
      const newId = `proj-${Date.now()}`;
      const newProj: Project = {
        id: newId,
        name: lPage.title,
        description: prompt,
        status: "In Design",
        page: lPage
      };

      const updated = [...projects, newProj];
      saveProjects(updated);
      setActiveProjectId(newId);
      
      addLog(`Created new project: ${lPage.title}`, "success");
      
      // Keep in Editor for a high-fidelity loading glance before flipping to Preview
      setTimeout(() => {
        addLog("Rendering active live viewport canvas.", "success");
        setCurrentTab("ProjectView");
        setIsGenerating(false);
      }, 2000);

    } catch (e) {
      clearInterval(telemetryTimer);
      console.error(e);
      addLog("Failed to reach server. Conducting offline procedural synthesis.", "info");
      
      // Fallback offline generator if endpoint fails
      setTimeout(() => {
        const fallbackPage: LandingPage = {
          id: `page-${Date.now()}`,
          title: prompt.split(" ")[0].toUpperCase() || "Cosmic App",
          heroHeading: "Construct Your",
          heroHighlight: prompt || "Digital Oasis",
          heroDescription: "Organized systematically with balanced grid margins, ambient twilight highlights, and clean typography.",
          ctaPrimaryLabel: "Explore Ecosystem",
          ctaSecondaryLabel: "Read Logs",
          colorPalette: {
            primary: "#c084fc",
            secondary: "#ec4899",
            tertiary: "#11121d",
            accent: "#6366f1",
            background: "#07080d"
          },
          features: [
            {
              metaLabel: "01 / SYNTHESIS SYSTEM",
              title: "Adaptive Fluidity",
              subtitle: "Procedural fallback node",
              description: "Harnessing background blur frames to protect absolute viewport fidelity.",
              icon: "Cpu"
            }
          ],
          testimonial: {
            quote: "A stellar representation of intuitive full-stack alignment.",
            author: "WaterFlow Observer",
            stars: 5
          },
          motionIntensity: 50,
          tone: "Visionary"
        };

        const newId = `proj-${Date.now()}`;
        const newProj: Project = {
          id: newId,
          name: fallbackPage.title,
          description: prompt,
          status: "Prototype",
          page: fallbackPage
        };

        saveProjects([...projects, newProj]);
        setActiveProjectId(newId);
        setIsGenerating(false);
        setCurrentTab("ProjectView");
      }, 3000);
    }
  };

  // Fine-tune parameters real-time
  const handleUpdateParams = (params: Partial<LandingPage>) => {
    if (!activeProjectId) return;
    
    const updated = projects.map(p => {
      if (p.id === activeProjectId) {
        // Log changes dynamically in background
        const keys = Object.keys(params).join(", ");
        addLog(`Modified project parameter: ${keys}`, "info");

        return {
          ...p,
          page: {
            ...p.page,
            ...params
          }
        };
      }
      return p;
    });

    saveProjects(updated);
  };

  // Re-generate current prompt
  const handleGenerateNewDraft = () => {
    if (!activeProject) return;
    addLog(`Initiated re-synthesis sequence for: ${activeProject.name}`, "info");
    handleGenerate(activeProject.description || activeProject.name);
  };

  // Select project from the Dashboard grid
  const handleSelectProject = (id: string, view: "ProjectView" | "Live Editor") => {
    setActiveProjectId(id);
    setCurrentTab(view);
    addLog(`Swapped active project focus: ${id}`, "info");
  };

  const handlePublish = () => {
    setShowPublishModal(true);
    addLog(`Project published successfully to outer cloud domains.`, "success");
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-white flex font-sans antialiased">
      
      {/* 1. Left side Dock nav */}
      <SideNavBar 
        currentTab={currentTab} 
        onChangeTab={(tab) => setCurrentTab(tab as any)} 
        activeProject={activeProject}
        onPublish={handlePublish}
        onShowToast={showToast}
      />

      {/* 2. Main Content viewport wrapper */}
      <div className="flex-1 pl-64 flex flex-col relative min-h-screen">
        
        {/* Sticky top-header search/user profile info */}
        <Header 
          currentTab={currentTab} 
          onSetTab={(tab) => setCurrentTab(tab)} 
          onNewProject={() => setCurrentTab('Generator')}
          liveViewActive={currentTab === 'ProjectView'}
          onShowToast={showToast}
        />

        {/* Dashboard Grid view */}
        <main className="p-8 max-w-7xl mx-auto w-full flex-grow relative pb-20">
          
          {currentTab === 'Dashboard' && (
            <ProjectGrid 
              projects={projects} 
              onSelectProject={handleSelectProject} 
              onInitNewStream={() => setCurrentTab('Generator')}
            />
          )}

          {currentTab === 'Generator' && (
            <GeneratorScreen 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating} 
            />
          )}

          {currentTab === 'Live Editor' && (
            <LiveEditorScreen 
              logs={activeProjectLogs} 
              isGenerating={isGenerating} 
              onPreviewClick={() => setCurrentTab('ProjectView')}
              brandName={activeProject ? activeProject.name : "Project Alpha"}
            />
          )}

          {currentTab === 'ProjectView' && activeProject && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative pb-10">
              
              {/* Left 9 column span rendered preview */}
              <div className="md:col-span-8 lg:col-span-9 border border-white/5 rounded-3xl overflow-hidden self-start bg-[#0a0c14] shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
                <LandingPagePreview page={activeProject.page} onShowToast={showToast} />
              </div>

              {/* Right refinement sidebar */}
              <div className="md:col-span-4 lg:col-span-3">
                <RefinementSidebar 
                  activeProject={activeProject}
                  onUpdateParams={handleUpdateParams}
                  onGenerateNewDraft={handleGenerateNewDraft}
                  onShowToast={showToast}
                />
              </div>

            </div>
          )}

          {/* Sub-tab mock layouts to maintain thorough workspace completeness */}
          {currentTab === 'Logs' && (
            <div className="bg-[#0b0c14]/80 backdrop-blur-xl min-h-[500px] border border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <h3 className="font-display text-2xl font-bold mb-2 flex items-center gap-2"><Terminal className="text-purple-400" /> System Telemetry Stack</h3>
                <p className="text-[#94a3b8] font-sans text-sm mb-6">Deep analytical traces of generative AI neural weights, responsive asset transforms, and static frame compilations.</p>
                
                <div className="bg-black/60 rounded-xl border border-white/5 p-5 font-mono text-xs text-[#94a3b8] space-y-3.5 h-80 overflow-y-auto">
                  {activeProjectLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="text-[#64748b]">{log.timestamp}</span>
                      <span className="text-purple-400 uppercase text-[10px] tracking-wider font-semibold">[{log.type || "INFO"}]</span>
                      <p className="text-gray-300">{log.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#64748b] mt-4 select-none">* Standard stream telemetry connects with the cloud run ingress cluster.</p>
            </div>
          )}

          {currentTab === 'Assets' && (
            <div className="bg-[#0b0c14]/80 backdrop-blur-xl min-h-[500px] border border-white/5 rounded-3xl p-8 shadow-2xl">
              <h3 className="font-display text-2xl font-bold mb-2 flex items-center gap-2"><FileText className="text-pink-400" /> Asset Delivery Pipeline</h3>
              <p className="text-[#94a3b8] text-sm mb-6">Explore the hotlinked visual graphics, compiled logos, and vector assets cached for active generations.</p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Coffee machine detail", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzQyFH6Bl6KbPsiNVSSOmb87w1wrTA2YTrZOSYWiG1Skfyuccpb332UxEoss_9r3x-rjzc8iY6DlOjtEpYXL2dpykq4FpdWX-JR9MEZeFNWFM50GJtseinfsk1PQ7Ei3FE7wBcKNX60TkxBzkKF_GYFXvpV_Kwt3nHMiYRcYOeLqf446-Md6rG2UvToROttbgNSIFRlZRetCBkVs4PUKAzRYklu7DVBgGPTyTqHlxFUQCRxMdfhcZxGXbXhHcMFzmIAZgSLPGuiEg" },
                  { name: "Starship orbital curve", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuByt1PCtVxOBCHnT47-2AaIoaaZqjX97W_0z8m1tX07bGy6x6F-_5CwxB8owwCwEKIZoHAKUM9ITUl9Yc95AytOZdcuL9-1jbXF2ogc-OCyTST2zNArIBa1znLiHlnireKcoFucfYUTtIgSI4YjRZ8BWK3WXjypzhpy2n611ysCzg2Z0rUCEILkNrVhL5OsUnf1PezJXdEe8ydAEf5RL9BUqNKepWNxoL3mcS6u5AWyVpR0UHQTsvMM8z2AukOnK2HTBQuIOmWO_-E" },
                  { name: "Zen Perfect raked path", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy7_lmE6V38nkZtnSkdBq4Bu7kVmhRN4HPCRO4DOrHhq-5NrLaUHxbBEJHLt1urIREqaRSLMOzUS92F41Q3I53m0yOrUn10c4DXl-rPOYiljLFLXUNcGd3q7ZhGbld2VsuHBh774cM5nmklswInuS8Ct0cL7rDzwoNO8si1es_D1Ate5teyCSCk6LydT583JgLkNmmuJ6gUlFz4RFtx8VelhBQICME8MTLJO3eK6pSz9SOjxtUxRL0zdFCYElDn7NOxLaEYgnEDCs" },
                  { name: "Fluid generative vector flow", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5bCbdA7_7sxtza9EwOvkN8GMrwYY5_4Am3y1qV0QvMXREj-8dvOB8uQ__070BHhmtbu44KyW2u4RnWcWemaPmcZyz_Mnd3Z2f8GI1TooOcqsQ-jS9Z4i7lmpU0tH9Vg1IwQ0axvzs7N6vgzE_kEKFKvKP-CjZptpcDPE6Cl02vuWi_Hxuogsh3E8wBJYGVd7RMMGMgBMzvmrvdrMzUMDSqiH7gXAhZYra_haSJralyPWBsG_F61678og91nd9SNYc_Brm5fpSVSU" }
                ].map((asset, index) => (
                  <div key={index} className="rounded-2xl overflow-hidden bg-[#0a0c14] border border-white/5 p-3 group shadow-lg">
                    <div className="h-32 overflow-hidden rounded-xl relative">
                      <img src={asset.src} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" referrerPolicy="no-referrer" />
                    </div>
                    <span className="font-mono text-[10px] text-[#94a3b8] mt-2 block tracking-tight text-center truncate">{asset.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'Settings' && (
            <div className="bg-[#0b0c14]/80 backdrop-blur-xl min-h-[500px] border border-white/5 rounded-3xl p-8 shadow-2xl">
              <h3 className="font-display text-2xl font-bold mb-2 flex items-center gap-2"><SettingsIcon className="text-blue-400" /> Project Configurations</h3>
              <p className="text-[#94a3b8] text-sm mb-6">Fine tune model selection targets, server environment, and access controls.</p>
              
              <div className="space-y-6 max-w-xl font-sans text-sm">
                <div className="p-5 bg-[#07080d] rounded-2xl border border-white/5 space-y-2">
                  <span className="text-white font-semibold block">Default Synthesis Model</span>
                  <p className="text-[#64748b] text-xs">WaterFlow operates on Gemini 3.5-flash by default for fast, rich, structured layouts.</p>
                  <select className="bg-[#07080d] text-white rounded-lg border border-white/10 px-4 py-2 mt-2 outline-none focus:border-purple-500 transition-colors">
                    <option>gemini-3.5-flash (Standard)</option>
                    <option>gemini-3.1-pro-preview (Advanced)</option>
                    <option>Offline simulation mode</option>
                  </select>
                </div>

                <div className="p-5 bg-[#07080d] rounded-2xl border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-white font-semibold block">Enable Client Sandbox Persistence</span>
                    <p className="text-[#64748b] text-xs">Auto-saves every design parameter update to local browser localStorage.</p>
                  </div>
                  <div className="w-10 h-6 bg-purple-500/20 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. Published Portal dialogue modal popup */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0c14] border border-white/5 max-w-md w-full rounded-3xl p-8 space-y-6 text-center shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] animate-pulse">
              <CheckCircle size={32} />
            </div>
            
            <div className="space-y-2 font-sans">
              <h4 className="font-display font-black text-2xl text-white">Draft Published</h4>
              <p className="text-[#94a3b8] text-sm">
                Your luxury generative brand page is now online. Share this link for real-time visual demonstration.
              </p>
            </div>

            <div className="bg-[#07080d] p-3.5 rounded-xl border border-white/5 font-mono text-xs flex justify-between items-center text-purple-400">
              <span className="truncate mr-2">waterflow.live/share/{activeProject ? activeProject.name.toLowerCase().replace(/\s+/g, '-') : 'project-alpha'}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`waterflow.live/share/${activeProject ? activeProject.name.toLowerCase().replace(/\s+/g, '-') : 'project-alpha'}`);
                  showToast("Share link copied to clipboard!", "success");
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg hover:opacity-95 text-[10px] tracking-widest uppercase shadow-[0_2px_10px_rgba(139,92,246,0.3)]"
              >
                Copy
              </button>
            </div>

            <button 
              onClick={() => setShowPublishModal(false)}
              className="w-full py-3.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/15 hover:to-indigo-500/15 border border-purple-500/20 rounded-xl font-mono text-xs text-purple-300 uppercase tracking-widest transition-all cursor-pointer"
            >
              Close Portal
            </button>
          </div>
        </div>
      )}

      {/* 4. Beautiful top-right Toast Notifications Stack */}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map(toast => {
          let variantStyle = "border-purple-500/30 bg-[#16122c]/95 text-purple-200";
          let Icon = Sparkles;
          if (toast.type === "success") {
            variantStyle = "border-emerald-500/30 bg-[#0e1f18]/95 text-emerald-100";
            Icon = Check;
          } else if (toast.type === "warning") {
            variantStyle = "border-amber-500/30 bg-[#251b12]/95 text-amber-100";
            Icon = AlertTriangle;
          }
          return (
            <div 
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-4 px-4.5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-slide-in-up w-80 ${variantStyle}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className="shrink-0" />
                <span className="font-sans text-xs font-semibold select-none leading-relaxed">{toast.message}</span>
              </div>
              <button 
                onClick={() => setToasts(current => current.filter(t => t.id !== toast.id))}
                className="text-white/45 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}

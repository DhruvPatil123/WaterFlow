export interface LandingPage {
  id: string;
  title: string;
  heroHeading: string;
  heroHighlight: string;
  heroDescription: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  colorPalette: {
    primary: string;
    secondary: string;
    tertiary: string; // Indigo or supportive tone
    accent: string;   // Optional complementary/error tone
    background: string;
  };
  features: Array<{
    title: string;
    subtitle: string;
    description: string;
    icon: string;       // Lucide icon string
    imageSrc?: string;  // Hotlinked image or fallback pattern
    metaLabel?: string; // e.g. "01 / REAL-TIME SYNTHESIS"
  }>;
  testimonial: {
    quote: string;
    author: string;
    stars: number;
  };
  motionIntensity: number; // 0 (static) to 100 (chaos)
  tone: "Visionary" | "Corporate";
  fontPairing?: "Sora & Hanken" | "Space Grotesk & Inter" | "Playfair & Georgia" | "Orbitron & Share Tech" | "Syne & Plus Jakarta" | "Fraunces & Sora";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Active" | "In Design" | "Prototype";
  page: LandingPage;
}

export interface AppState {
  currentTab: "Generator" | "Live Editor" | "Logs" | "Assets" | "Settings" | "Dashboard" | "ProjectView";
  projects: Project[];
  activeProjectId: string | null;
  activeProjectLogs: { timestamp: string; text: string; type?: "info" | "success" | "magic" }[];
  isGenerating: boolean;
  generatorPrompt: string;
}

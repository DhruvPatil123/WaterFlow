import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry user-agent
let aiClient: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully.");
  } else {
    console.log("No valid GEMINI_API_KEY found. Operating in local fallback simulation mode.");
  }
} catch (err) {
  console.error("Failed to initialize Gemini SDK:", err);
}

// Pre-built fallback templates matching screenshots and smart creations
const FALLBACK_TEMPLATES: Record<string, any> = {
  "luminal coffee": {
    title: "Luminal Coffee",
    heroHeading: "Awaken Your",
    heroHighlight: "Digital Senses",
    heroDescription: "Experience coffee through a lens of ethereal geometry and cosmic motion. Luminal blends artisanal precision with technological wonder.",
    ctaPrimaryLabel: "Explore the Roast",
    ctaSecondaryLabel: "View Showcase",
    colorPalette: {
      primary: "#d0bcff",
      secondary: "#4cd7f6",
      tertiary: "#131b2e",
      accent: "#ffb4ab",
      background: "#0b1326"
    },
    features: [
      {
        metaLabel: "01 / AUTOMATED BLOOM",
        title: "Molecular Precision",
        subtitle: "Cosmic extraction algorithms",
        description: "Every bean is analyzed by our proprietary AI to ensure the perfect roast profile for your unique palate.",
        icon: "Cpu"
      },
      {
        metaLabel: "02 / INSTANT BREW",
        title: "Zero Latency",
        subtitle: "Haptic brewing telemetry",
        description: "Instant roast generation based on your current biometric signals.",
        icon: "Zap"
      },
      {
        metaLabel: "03 / CELESTIAL SOURCING",
        title: "Cosmic Blends",
        subtitle: "Orbital greenhouse gardens",
        description: "Sourced from terrestrial gardens, refined in celestial labs.",
        icon: "Sparkles"
      }
    ],
    testimonial: {
      quote: "The Luminal roast actually feels like drinking a supernova.",
      author: "Aura Digitalis",
      stars: 5
    },
    motionIntensity: 75,
    tone: "Visionary"
  },
  "spacex clone": {
    title: "SpaceX Clone",
    heroHeading: "Sailing the",
    heroHighlight: "Cosmic Ocean",
    heroDescription: "An awe-inspiring digital explorer of orbiters, modular rockets, and celestial navigation panels engineered with physical fidelity.",
    ctaPrimaryLabel: "Launch Mission",
    ctaSecondaryLabel: "Telemetry Data",
    colorPalette: {
      primary: "#acedff",
      secondary: "#a078ff",
      tertiary: "#222a3d",
      accent: "#4cd7f6",
      background: "#060e20"
    },
    features: [
      {
        metaLabel: "01 / MISSION STATUS",
        title: "Sleek Ascent",
        subtitle: "Telemetry tracker logs",
        description: "Watch modular white starships ascend through deep indigo nebulae under physical constraints.",
        icon: "Rocket"
      },
      {
        metaLabel: "02 / ORBIT CONTROLS",
        title: "Dynamic Timers",
        subtitle: "Time dilations matched",
        description: "Countdowns and real-time celestial coordinates stream on-grid.",
        icon: "Timer"
      }
    ],
    testimonial: {
      quote: "Celestial visualizations on AetherFlow feel remarkably authentic.",
      author: "Starship Cadet",
      stars: 5
    },
    motionIntensity: 45,
    tone: "Corporate"
  },
  "zen garden": {
    title: "Zen Garden",
    heroHeading: "Cultivate Perfect",
    heroHighlight: "Mental Harmony",
    heroDescription: "A serene interactive wellness platform with minimalist styling, atmospheric ambient visualizer boards, and raked sand physics.",
    ctaPrimaryLabel: "Rake the Sand",
    ctaSecondaryLabel: "Decompress Now",
    colorPalette: {
      primary: "#c4c1fb",
      secondary: "#4cd7f6",
      tertiary: "#171f33",
      accent: "#8e8bc2",
      background: "#0b1326"
    },
    features: [
      {
        metaLabel: "01 / SAND DYNAMICS",
        title: "Raked Equilibrium",
        subtitle: "Perfect geometric styling",
        description: "Interactive cherry blossoms fall on calm stone paths as you guide your energy path.",
        icon: "Flower"
      }
    ],
    testimonial: {
      quote: "A breathtaking experience of pure calm and modular alignment.",
      author: "Ethereal Curator",
      stars: 5
    },
    motionIntensity: 20,
    tone: "Visionary"
  }
};

// Generative endpoint
app.post("/api/generate", async (req, res) => {
  const { prompt, tone = "Visionary" } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "A prompt string is required." });
  }

  const normalized = prompt.toLowerCase().trim();

  // 1. Check for specific pre-built terms first to match user screenshots flawlessly
  for (const key of Object.keys(FALLBACK_TEMPLATES)) {
    if (normalized.includes(key)) {
      console.log(`Matching exact fallback template for "${key}"`);
      return res.json(FALLBACK_TEMPLATES[key]);
    }
  }

  // 2. Query Gemini API if configured
  if (aiClient) {
    try {
      console.log(`Calling Gemini API for prompt: "${prompt}"`);
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create a fully structured design configuration for a luxury, high-tech landing page called "${prompt}". Make the content extremely creative, poetic, and cosmic, reflecting the vibe of a futuristic wizard platform. Make sure color schemes match the theme beautifully. Use realistic Hex colors. Choose 2 or 3 bento features, each with a fitting metaLabel, title, subtitle, description, and a Lucide icon string name (e.g., "Cpu", "Zap", "Sparkles", "Rocket", "Atom", "Flame", "Shield", "LineChart", "Terminal", "Activity").`,
        config: {
          systemInstruction: "You are the AetherFlow Generative Web Design Engine. You output ultra-sophisticated Cosmic-themed design payloads in strict JSON format matching the schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "title", "heroHeading", "heroHighlight", "heroDescription",
              "ctaPrimaryLabel", "ctaSecondaryLabel", "colorPalette", "features", "testimonial", "motionIntensity", "tone"
            ],
            properties: {
              title: { type: Type.STRING, description: "Name of the brand landing page" },
              heroHeading: { type: Type.STRING, description: "Hero main text leading part (e.g. 'Awaken Your')" },
              heroHighlight: { type: Type.STRING, description: "Highly polished glowing keyword of headline (e.g. 'Digital Senses')" },
              heroDescription: { type: Type.STRING, description: "Elegant, sophisticated brand description" },
              ctaPrimaryLabel: { type: Type.STRING, description: "Primary call to action button" },
              ctaSecondaryLabel: { type: Type.STRING, description: "Secondary call to action button" },
              colorPalette: {
                type: Type.OBJECT,
                required: ["primary", "secondary", "tertiary", "accent", "background"],
                properties: {
                  primary: { type: Type.STRING, description: "Hex code (glowing primary violet/purple e.g., #d0bcff)" },
                  secondary: { type: Type.STRING, description: "Hex code (glowing secondary cyan/blue/teal e.g., #4cd7f6)" },
                  tertiary: { type: Type.STRING, description: "Hex code (glass panel background e.g., #131b2e)" },
                  accent: { type: Type.STRING, description: "Hex code (supportive warning/highlight e.g., #ffb4ab)" },
                  background: { type: Type.STRING, description: "Hex code (midnight backdrop e.g., #0b1326)" },
                },
              },
              features: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["metaLabel", "title", "subtitle", "description", "icon"],
                  properties: {
                    metaLabel: { type: Type.STRING, description: "Small, all-uppercase uppercase tag like '01 / SYSTEM STATUS'" },
                    title: { type: Type.STRING, description: "Feature title" },
                    subtitle: { type: Type.STRING, description: "Short micro sub-title description" },
                    description: { type: Type.STRING, description: "Full feature description text" },
                    icon: { type: Type.STRING, description: "A valid Lucide icon name, capitalized first letter, e.g. Rocket, Sparkles, Cpu, Zap, Activity" },
                  },
                },
              },
              testimonial: {
                type: Type.OBJECT,
                required: ["quote", "author", "stars"],
                properties: {
                  quote: { type: Type.STRING, description: "Highly inspiring user quote" },
                  author: { type: Type.STRING, description: "Author name or handles like '@AuraDigitalis'" },
                  stars: { type: Type.INTEGER, description: "Rating from 1 to 5" },
                },
              },
              motionIntensity: { type: Type.INTEGER, description: "Default motion intensive percentage (0 to 100)" },
              tone: { type: Type.STRING, enum: ["Visionary", "Corporate"], description: "Default brand theme styling mode" },
            },
          },
        },
      });

      const text = response.text;
      if (text) {
        const payload = JSON.parse(text.trim());
        return res.json(payload);
      }
    } catch (err) {
      console.error("Gemini Generation failed, falling back to procedural:", err);
    }
  }

  // 3. Fallback logic: Procedurally construct landing page based on words in prompt
  console.log("Generating procedural cosmic theme fallback page.");
  const words = normalized.split(" ");
  const capitalizedTitle = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  
  // Choose procedural color scheme
  let palette = {
    primary: "#d0bcff",
    secondary: "#4cd7f6",
    tertiary: "#171f33",
    accent: "#ffb4ab",
    background: "#0b1326"
  };

  if (normalized.includes("cyberpunk") || normalized.includes("neon")) {
    palette = {
      primary: "#ff007f",
      secondary: "#00ffff",
      tertiary: "#1a0b2e",
      accent: "#ffff00",
      background: "#08020f"
    };
  } else if (normalized.includes("biotech") || normalized.includes("eco") || normalized.includes("forest")) {
    palette = {
      primary: "#00ff88",
      secondary: "#2bd9fe",
      tertiary: "#112a20",
      accent: "#d4af37",
      background: "#05120d"
    };
  } else if (normalized.includes("fire") || normalized.includes("magma") || normalized.includes("sun")) {
    palette = {
      primary: "#ff5e00",
      secondary: "#ffd000",
      tertiary: "#2e1205",
      accent: "#ff3333",
      background: "#0d0401"
    };
  }

  const generatedPage = {
    title: capitalizedTitle || "Cosmic Vision",
    heroHeading: "Architect Your",
    heroHighlight: capitalizedTitle || "Digital Dream",
    heroDescription: `Experience ${capitalizedTitle || "cosmic technology"} through a highly aligned physical grid and luminous ambient energy systems. Made with procedural alignment modules.`,
    ctaPrimaryLabel: "Initiate System",
    ctaSecondaryLabel: "Analyze Telemetry",
    colorPalette: palette,
    features: [
      {
        metaLabel: "01 / QUANTUM ALIGNMENT",
        title: "Heuristic Mastery",
        subtitle: "Zero latent architecture",
        description: `Your custom prompt "${prompt}" was organized with optimal grid rendering, high-density layouts, and soft twilight glassmorphism.`,
        icon: "Cpu"
      },
      {
        metaLabel: "02 / FLUID METRICS",
        title: "Stochastic Flow",
        subtitle: "Adaptive cosmic nodes",
        description: "Harnessing background blurs, deep backdrop translucency, and responsive modular micro-interactions.",
        icon: "Activity"
      }
    ],
    testimonial: {
      quote: `Drinking in the ethereal geometric alignment of this generated ${capitalizedTitle} page is purely mesmerizing.`,
      author: "Cosmic Voyager",
      stars: 5
    },
    motionIntensity: 60,
    tone: tone === "Corporate" ? "Corporate" : "Visionary"
  };

  return res.json(generatedPage);
});

// AI-powered refinement endpoint to edit/refine existing styles based on natural language command
app.post("/api/refine", async (req, res) => {
  const { page, command } = req.body;

  if (!page || !command || typeof command !== "string") {
    return res.status(400).json({ error: "Both 'page' configuration and 'command' string are required." });
  }

  if (aiClient) {
    try {
      console.log(`Calling Gemini API for refinement command: "${command}"`);
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are the AetherFlow Generative Web Design Engine.
You are given the current design configuration of a landing page:
${JSON.stringify(page, null, 2)}

The user would like to edit or refine this landing page with the following natural language instruction command:
"${command}"

Modify the design configuration according to the user's instructions.
- Preserve the existing layout structure where applicable unless they ask to redesign it.
- Modify the fields requested by the user, or fields that logically need to match the user's requested changes (for instance, if they ask to make it themed for biotech or starships, update the color palette, text titles, descriptions, and features accordingly).
- Use valid, beautifully matching Hex codes.
- Return a valid, complete JSON object matching the schema.`,
        config: {
          systemInstruction: "You are the AetherFlow Web Design AI Copilot. You parse refinement instructions and return updated landing page design payloads in strict JSON format matching the schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "title", "heroHeading", "heroHighlight", "heroDescription",
              "ctaPrimaryLabel", "ctaSecondaryLabel", "colorPalette", "features", "testimonial", "motionIntensity", "tone"
            ],
            properties: {
              title: { type: Type.STRING, description: "Name of the brand landing page" },
              heroHeading: { type: Type.STRING, description: "Hero main text leading part" },
              heroHighlight: { type: Type.STRING, description: "Highly polished glowing keyword of headline" },
              heroDescription: { type: Type.STRING, description: "Elegant, sophisticated brand description" },
              ctaPrimaryLabel: { type: Type.STRING, description: "Primary call to action button" },
              ctaSecondaryLabel: { type: Type.STRING, description: "Secondary call to action button" },
              colorPalette: {
                type: Type.OBJECT,
                required: ["primary", "secondary", "tertiary", "accent", "background"],
                properties: {
                  primary: { type: Type.STRING, description: "Hex code (glowing primary e.g., #d0bcff)" },
                  secondary: { type: Type.STRING, description: "Hex code (glowing secondary e.g., #4cd7f6)" },
                  tertiary: { type: Type.STRING, description: "Hex code (glass panel background e.g., #131b2e)" },
                  accent: { type: Type.STRING, description: "Hex code (supportive warning/highlight e.g., #ffb4ab)" },
                  background: { type: Type.STRING, description: "Hex code (midnight backdrop e.g., #0b1326)" },
                },
              },
              features: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["metaLabel", "title", "subtitle", "description", "icon"],
                  properties: {
                    metaLabel: { type: Type.STRING, description: "Small, all-uppercase tag like '01 / SYSTEM STATUS'" },
                    title: { type: Type.STRING, description: "Feature title" },
                    subtitle: { type: Type.STRING, description: "Short micro sub-title description" },
                    description: { type: Type.STRING, description: "Full feature description text" },
                    icon: { type: Type.STRING, description: "A valid Lucide icon name, capitalized first letter, e.g. Rocket, Sparkles, Cpu, Zap, Activity" },
                  },
                },
              },
              testimonial: {
                type: Type.OBJECT,
                required: ["quote", "author", "stars"],
                properties: {
                  quote: { type: Type.STRING, description: "Highly inspiring user quote" },
                  author: { type: Type.STRING, description: "Author name or handle like '@AuraDigitalis'" },
                  stars: { type: Type.INTEGER, description: "Rating from 1 to 5" },
                },
              },
              motionIntensity: { type: Type.INTEGER, description: "Motion intensive percentage (0 to 100)" },
              tone: { type: Type.STRING, enum: ["Visionary", "Corporate"], description: "Brand theme styling mode" },
            },
          },
        },
      });

      const text = response.text;
      if (text) {
        const payload = JSON.parse(text.trim());
        return res.json(payload);
      }
    } catch (err) {
      console.error("Gemini refinement failed:", err);
    }
  }

  // Fallback procedural/offline refinement if Gemini is offline
  console.log("Gemini offline. Performing simple procedural replacement refinement.");
  const updatedPage = { ...page };
  const cmdLower = command.toLowerCase();

  // Parse direct text commands (e.g. set title to "Coffee World")
  const titleMatch = command.match(/title\s+(?:to|is|=)\s*["']?([^"']+)["']?/i);
  if (titleMatch && titleMatch[1]) {
    updatedPage.title = titleMatch[1];
  }

  const headingMatch = command.match(/heading\s+(?:to|is|=)\s*["']?([^"']+)["']?/i);
  if (headingMatch && headingMatch[1]) {
    updatedPage.heroHeading = headingMatch[1];
  }

  const descMatch = command.match(/desc(?:ription)?\s+(?:to|is|=)\s*["']?([^"']+)["']?/i);
  if (descMatch && descMatch[1]) {
    updatedPage.heroDescription = descMatch[1];
  }

  const primaryBtnMatch = command.match(/primary\s+(?:button|cta)\s+(?:to|is|=)\s*["']?([^"']+)["']?/i);
  if (primaryBtnMatch && primaryBtnMatch[1]) {
    updatedPage.ctaPrimaryLabel = primaryBtnMatch[1];
  }

  // Color keywords fallback
  if (cmdLower.includes("red") || cmdLower.includes("crimson") || cmdLower.includes("fire")) {
    updatedPage.colorPalette = {
      primary: "#ff3e3e",
      secondary: "#ffaa44",
      tertiary: "#220808",
      accent: "#ff0055",
      background: "#0c0101"
    };
  } else if (cmdLower.includes("green") || cmdLower.includes("emerald") || cmdLower.includes("plant")) {
    updatedPage.colorPalette = {
      primary: "#00ff88",
      secondary: "#2bd9fe",
      tertiary: "#112a20",
      accent: "#d4af37",
      background: "#05120d"
    };
  } else if (cmdLower.includes("pink") || cmdLower.includes("rose") || cmdLower.includes("neon")) {
    updatedPage.colorPalette = {
      primary: "#ff007f",
      secondary: "#ffd0ed",
      tertiary: "#1f0925",
      accent: "#00ffff",
      background: "#0b020d"
    };
  } else if (cmdLower.includes("gold") || cmdLower.includes("amber") || cmdLower.includes("sunset")) {
    updatedPage.colorPalette = {
      primary: "#ffb000",
      secondary: "#ff7000",
      tertiary: "#2a1500",
      accent: "#ffdd00",
      background: "#0f0800"
    };
  }

  return res.json(updatedPage);
});

// Configure Vite or Serve Static Files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import React from 'react';
import { LandingPage } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { Star, ArrowUpRight } from 'lucide-react';

interface LandingPagePreviewProps {
  page: LandingPage;
  onShowToast?: (message: string, type?: "success" | "info" | "warning") => void;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({ page, onShowToast }) => {
  const { colorPalette, motionIntensity, fontPairing } = page;

  // Font pairing mapping utility to resolve custom typographies instantly
  const getFontFamilies = (pairing?: string) => {
    switch (pairing) {
      case "Space Grotesk & Inter":
        return {
          display: "'Space Grotesk', system-ui, sans-serif",
          body: "Inter, system-ui, sans-serif",
          mono: "'JetBrains Mono', monospace"
        };
      case "Playfair & Georgia":
        return {
          display: "'Playfair Display', Georgia, serif",
          body: "Georgia, serif",
          mono: "Georgia, serif"
        };
      case "Orbitron & Share Tech":
        return {
          display: "'Orbitron', system-ui, sans-serif",
          body: "'Share Tech Mono', monospace",
          mono: "'Share Tech Mono', monospace"
        };
      case "Syne & Plus Jakarta":
        return {
          display: "'Syne', system-ui, sans-serif",
          body: "'Plus Jakarta Sans', system-ui, sans-serif",
          mono: "'JetBrains Mono', monospace"
        };
      case "Fraunces & Sora":
        return {
          display: "'Fraunces', serif",
          body: "'Sora', system-ui, sans-serif",
          mono: "'JetBrains Mono', monospace"
        };
      default:
        return {
          display: "'Sora', sans-serif",
          body: "'Hanken Grotesk', sans-serif",
          mono: "'JetBrains Mono', monospace"
        };
    }
  };

  const fonts = getFontFamilies(fontPairing);

  // Derive inline styles directly based on generative color palette hexes.
  const appStyles = {
    backgroundColor: colorPalette.background,
    color: '#ffffff',
    fontFamily: fonts.body
  };

  const primaryBg = { backgroundColor: colorPalette.primary };
  const containerStyle = {
    backgroundColor: colorPalette.tertiary,
    borderColor: `${colorPalette.primary}20`
  };

  // Dynamically calculate speed of flowing background sphere animation depending on motionIntensity
  const glowSpeedScale = motionIntensity === 0 ? '0s' : `${Math.max(5, 50 - motionIntensity / 2)}s`;

  // Dynamically scale columns depending on bento features size
  const gridLayoutClass = page.features.length === 1 
    ? "grid grid-cols-1 max-w-xl mx-auto gap-6" 
    : page.features.length === 2 
      ? "grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6" 
      : page.features.length === 4
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        : "grid grid-cols-1 md:grid-cols-3 gap-6";

  return (
    <div 
      style={appStyles}
      className="w-full min-h-screen relative overflow-hidden transition-colors duration-400 pb-20 rounded-3xl border border-[#d0bcff]/15 shadow-3xl"
      id="rendered_preview_viewport"
    >
      
      {/* Dynamic Animated backing spheres controlled by Refinement motion scale */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Sphere 1 */}
        <div 
          style={{
            background: `radial-gradient(circle, ${colorPalette.primary}35 0%, transparent 70%)`,
            animation: motionIntensity > 0 ? `fluid-glow ${glowSpeedScale} ease-in-out 0s infinite alternate` : 'none',
            top: '10%',
            left: '5%',
            width: '600px',
            height: '600px'
          }}
          className="absolute rounded-full blur-[90px] mix-blend-screen opacity-70"
        />

        {/* Sphere 2 */}
        <div 
          style={{
            background: `radial-gradient(circle, ${colorPalette.secondary}30 0%, transparent 70%)`,
            animation: motionIntensity > 0 ? `fluid-glow ${glowSpeedScale} ease-in-out -4s infinite alternate-reverse` : 'none',
            bottom: '15%',
            right: '5%',
            width: '500px',
            height: '500px'
          }}
          className="absolute rounded-full blur-[100px] mix-blend-screen opacity-60"
        />
        
      </div>

      {/* Embedded Navigation Hub */}
      <nav className="w-full flex justify-between items-center px-8 py-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
            <span className="w-3.5 h-3.5 rounded-full" style={primaryBg}></span>
          </div>
          <span 
            style={{ fontFamily: fonts.display }}
            className="font-medium text-lg leading-tight uppercase tracking-wider text-white"
          >
            {page.title}
          </span>
        </div>
        <div 
          style={{ fontFamily: fonts.mono }}
          className="flex items-center gap-5 text-xs tracking-widest text-[#cbc3d7]/80 uppercase"
        >
          <a href="#features" className="hover:text-white transition-colors">FEATURES</a>
          <a href="#reviews" className="hover:text-white transition-colors">AURA</a>
          <span 
            style={{ borderColor: `${colorPalette.primary}33`, color: colorPalette.primary }}
            className="px-3 py-1.5 rounded-full border text-[10px]"
          >
            {page.tone}
          </span>
        </div>
      </nav>

      {/* Main Container contents */}
      <div className="max-w-6xl mx-auto px-8 relative z-10 pt-12 md:pt-20 space-y-24">
        
        {/* HERO INTRO */}
        <section className="text-center md:text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8 space-y-6">
            
            <div 
              style={{ fontFamily: fonts.mono, borderColor: `${colorPalette.primary}22`, color: colorPalette.primary }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border text-xs tracking-widest uppercase"
            >
              <span>SYSTEM COMPILED</span>
            </div>

            <h1 
              style={{ fontFamily: fonts.display }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none"
            >
              {page.heroHeading}{' '}
              <span 
                style={{
                  backgroundImage: `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.secondary}, ${colorPalette.primary})`,
                  backgroundSize: '200% auto'
                }}
                className="text-transparent bg-clip-text animate-text-shimmer"
              >
                {page.heroHighlight}
              </span>
            </h1>

            <p className="text-[#cbc3d7] text-lg md:text-xl leading-relaxed max-w-xl">
              {page.heroDescription}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 animate-fade-in">
              <button 
                style={{ 
                  backgroundColor: colorPalette.primary,
                  boxShadow: `0 4px 20px ${colorPalette.primary}50`
                }}
                onClick={() => onShowToast ? onShowToast(`Action sequence initiated: ${page.ctaPrimaryLabel}`, "success") : alert(`Initiating sequence for: ${page.ctaPrimaryLabel}`)}
                className="px-8 py-3.5 rounded-full text-[#0b1326] text-sm font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                id="btn_landing_hero_primary"
              >
                <span>{page.ctaPrimaryLabel}</span>
                <ArrowUpRight size={15} />
              </button>

              <button 
                style={{ 
                  borderColor: `${colorPalette.secondary}44`,
                  color: colorPalette.secondary
                }}
                onClick={() => onShowToast ? onShowToast(`Secondary sequence triggered: ${page.ctaSecondaryLabel}`, "info") : alert(`Launching sequence for: ${page.ctaSecondaryLabel}`)}
                className="px-8 py-3.5 rounded-full border bg-white/5 text-sm hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                id="btn_landing_hero_secondary"
              >
                <span>{page.ctaSecondaryLabel}</span>
              </button>
            </div>

          </div>

          {/* Graphical side mockup representing premium spatial cards */}
          <div className="md:col-span-4 flex justify-center">
            <div 
              style={containerStyle}
              className="w-full max-w-sm rounded-3xl p-6 border shadow-2xl relative overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 blur-2xl opacity-40 rounded-full" style={{ backgroundColor: colorPalette.secondary }}></div>
              <div className="flex justify-between items-start mb-6">
                <span 
                  style={{ fontFamily: fonts.mono }}
                  className="text-[9px] uppercase tracking-wider text-[#958ea0]"
                >
                  System Health
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping"></span>
              </div>
              <div className="space-y-4">
                <div className="h-6 w-2/3 rounded-md bg-white/5 border border-white/10"></div>
                <div className="space-y-2 pt-2">
                  <div className="h-2 w-full bg-slate-800 rounded"></div>
                  <div className="h-2 w-5/6 bg-slate-800 rounded"></div>
                  <div className="h-2 w-4/5 bg-slate-800 rounded"></div>
                </div>
                <div 
                  style={{ fontFamily: fonts.mono }}
                  className="h-24 rounded-2xl bg-[#0b1326]/50 border border-white/5 flex items-center justify-center text-xs text-[#958ea0]"
                >
                  {page.title.toUpperCase()} TERMINAL LOG_
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="space-y-12">
          
          <div className="text-center space-y-3">
            <h2 
              style={{ fontFamily: fonts.display }}
              className="text-3xl font-bold text-white tracking-tight"
            >
              Core Mechanics
            </h2>
            <p className="text-[#cbc3d7]/80 text-sm max-w-lg mx-auto">
              Our spatial systems adapt in real-time to bring absolute geometric integrity to your ecosystem.
            </p>
          </div>

          <div className={gridLayoutClass}>
            {page.features.map((feature, idx) => (
              <div 
                key={idx}
                style={containerStyle}
                className="rounded-3xl p-6 border-2 hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between min-h-[250px] relative group"
                id={`feature_preview_card_${idx}`}
              >
                
                {/* Glowing cover on hover */}
                <div 
                  style={{ backgroundColor: `${colorPalette.secondary}05` }}
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                />

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <span 
                      style={{ color: colorPalette.primary, fontFamily: fonts.mono }}
                      className="text-[10px] uppercase tracking-widest"
                    >
                      {feature.metaLabel || `0${idx + 1} / METRICS`}
                    </span>
                    <div 
                      style={{ 
                        backgroundColor: `${colorPalette.secondary}15`,
                        color: colorPalette.secondary
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10"
                    >
                      <DynamicIcon name={feature.icon} size={15} />
                    </div>
                  </div>

                  <h3 
                    style={{ fontFamily: fonts.display }}
                    className="font-semibold text-lg text-white group-hover:translate-x-1 transition-transform"
                  >
                    {feature.title}
                  </h3>
                  <p 
                    style={{ fontFamily: fonts.mono }}
                    className="text-[#958ea0] text-[11px] leading-tight mt-0.5"
                  >
                    {feature.subtitle}
                  </p>
                  <p className="text-[#cbc3d7] text-xs leading-relaxed pt-2">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 flex justify-end relative z-10">
                  <span className="w-5 h-5 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                    <ArrowUpRight size={10} className="text-[#958ea0] group-hover:text-white" />
                  </span>
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* TESTIMONIAL VIEW SECTION */}
        <section id="reviews" className="pb-10">
          <div 
            style={containerStyle}
            className="rounded-3xl p-8 border shadow-xl relative overflow-hidden"
          >
            {/* Background vector accents matching theme */}
            <div className="absolute top-[-50%] right-[-10%] w-72 h-72 rounded-full opacity-35 blur-3xl" style={{ backgroundColor: colorPalette.primary }} />

            <div className="relative z-10 max-w-2xl space-y-6">
              
              {/* Stars rendering */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < page.testimonial.stars ? "text-amber-400 fill-amber-400" : "text-slate-600"} 
                  />
                ))}
              </div>

              {/* Quote block */}
              <p 
                style={{ fontFamily: fonts.display }}
                className="text-2xl md:text-3xl italic text-white font-medium tracking-tight leading-snug"
              >
                "{page.testimonial.quote}"
              </p>

              {/* Author description */}
              <div className="flex items-center gap-3">
                <div 
                  style={{ fontFamily: fonts.mono }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white bg-slate-800 border border-white/10 font-bold uppercase"
                >
                  {page.testimonial.author.charAt(0)}
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">{page.testimonial.author}</h5>
                  <p 
                    style={{ fontFamily: fonts.mono }}
                    className="text-[#958ea0] text-[10px] uppercase tracking-wider"
                  >
                    WATERFLOW VERIFIED REVEALER
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
export default LandingPagePreview;

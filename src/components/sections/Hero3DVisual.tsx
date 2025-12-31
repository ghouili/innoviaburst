import { useState, useEffect, useRef } from "react";
import Hero3DCanvas from "./Hero3DCanvas";

interface Hero3DVisualProps {
  className?: string;
}

/**
 * Loading placeholder with skeleton and spinner
 */
function LoadingPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-light/20 to-secondary/10 rounded-2xl">
      <div className="relative">
        {/* Orbital animation */}
        <div className="w-20 h-20 rounded-full border-2 border-accent/30 animate-pulse" />
        <div
          className="absolute inset-2 w-16 h-16 rounded-full border-2 border-accent/50 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        <div className="absolute inset-4 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Loading 3D...</p>
    </div>
  );
}

/*
 * Sketchfab Robot Embed - Interactive 3D robot model
 * Uses Sketchfab's embed with autospin, autostart, and transparent background
 * COMMENTED OUT: Using local GLB model instead
 */
// function SketchfabEmbed({
//   isLoaded,
//   onLoad,
// }: {
//   isLoaded: boolean;
//   onLoad: () => void;
// }) {
//   return (
//     <iframe
//       title="AI Robot - Automation Visualization"
//       className={`w-full h-full border-0 transition-opacity duration-500 ${
//         isLoaded ? "opacity-100" : "opacity-0"
//       }`}
//       src="https://www.fab.com/dope/d4b3b6d4-20f9-4927-a566-9e9d2163d86e"
//       allow="autoplay; fullscreen; xr-spatial-tracking"
//       allowFullScreen
//       onLoad={onLoad}
//     />
//   );
// }

/**
 * Hero3DVisual - Main component that handles the 3D visualization
 * Displays the GLB model centered with no background
 */
export function Hero3DVisual({ className = "" }: Hero3DVisualProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(container);

    // Fallback: load after delay even if not in view
    const fallbackTimer = setTimeout(() => setShouldLoad(true), 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      style={{ minHeight: "400px" }}
      aria-label="3D AI robot visualization"
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingPlaceholder />
        </div>
      )}

      {/* GLB Model Canvas (lazy loaded) - centered, no background */}
      {shouldLoad && (
        <div className="absolute inset-0">
          {/* SketchfabEmbed commented out - using local GLB model instead */}
          {/* <SketchfabEmbed
            isLoaded={isLoaded}
            onLoad={() => setIsLoaded(true)}
          /> */}
          <Hero3DCanvas
            onError={() => {}}
            animate={true}
            onLoaded={() => setIsLoaded(true)}
          />
        </div>
      )}
    </div>
  );
}

export default Hero3DVisual;

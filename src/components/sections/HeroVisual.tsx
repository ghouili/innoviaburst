import HeroImageFallback from "../../assets/heroIMG-fallback.png";
import HeroImageWebp480 from "../../assets/heroIMG-480.webp";
import HeroImageWebp768 from "../../assets/heroIMG-768.webp";
import HeroImageWebp1024 from "../../assets/heroIMG-1024.webp";
import HeroImageWebp1920 from "../../assets/heroIMG-1920.webp";

interface HeroVisualProps {
  className?: string;
}

export function HeroVisual({ className = "" }: HeroVisualProps) {
  return (
    <div
      className={`relative w-full max-w-[480px] sm:max-w-[560px] lg:max-w-[820px] xl:max-w-[940px] lg:translate-x-4 xl:translate-x-8 ${className}`}
    >
      {/* Soft glow behind image for premium feel */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 lg:-inset-10 rounded-[40px] bg-gradient-to-tr from-primary/15 via-accent/10 to-transparent blur-2xl opacity-80"
      />

      {/* Aspect-ratio wrapper to prevent CLS */}
      <div className="relative aspect-[4/3] lg:aspect-auto max-h-[320px] sm:max-h-[380px] lg:max-h-none">
        <picture>
          <source
            type="image/webp"
            srcSet={`${HeroImageWebp480} 480w, ${HeroImageWebp768} 768w, ${HeroImageWebp1024} 1024w, ${HeroImageWebp1920} 1920w`}
            sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, (max-width: 1280px) 1024px, 940px"
          />
          <img
            src={HeroImageFallback}
            alt=""
            aria-hidden="true"
            width={940}
            height={705}
            loading="eager"
            decoding="async"
            // @ts-expect-error -- fetchpriority is valid HTML but React types use camelCase
            fetchpriority="high"
            className="relative w-full h-full object-contain object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.12)] lg:scale-[1.08] xl:scale-[1.12]"
          />
        </picture>
      </div>
    </div>
  );
}

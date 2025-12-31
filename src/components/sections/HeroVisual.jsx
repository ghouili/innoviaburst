import HeroImage from "../../assets/heroIMG.png";

export function HeroVisual() {
  return (
    <div className="">
      <img
        src={HeroImage} // export as png/webp/avif
        alt="" // decorative (see note below)
        // width={1200}
        // height={1200}
        // priority
        // sizes="(max-width: 1024px) 320px, 520px"
        className="h-auto w-auto drop-shadow-[0_18px_40px_rgba(0,0,0,0.10)]"
      />
    </div>
  );
}

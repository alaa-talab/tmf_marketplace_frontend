import { Hero } from "@/components/layout/hero";
import { FloatingImages } from "@/components/layout/FloatingImages";
import { CategorySection } from "@/components/home/CategorySection";
import { GridPattern } from "@/components/ui/GridPattern";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { Camera, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative z-10 bg-background mb-[400px]">

      {/* Background Grid - Global Texture */}
      <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <GridPattern width={50} height={50} className="stroke-foreground" />
      </div>

      <Hero />

      <div className="relative z-10 space-y-24 pb-24">
        <FloatingImages />

        {/* Infinite Marquee Section */}
        <section className="py-10 border-y border-white/5 backdrop-blur-sm">
          <InfiniteMarquee
            items={["Landscape", "Porterait", "Cyberpunk", "Minimal", "Abstract", "Nature", "Industrial", "Fashion", "Street", "Aerial"]}
            speed="slow"
          />
        </section>

        {/* Features Section with Spotlight Cards */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans tracking-tight mb-4">Why TMF?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We are built for the modern creator. Experience the difference of a platform designed for quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SpotlightCard className="p-8 group">
              <div className="mb-4 p-4 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Global CDN delivery ensuring your assets are available instantly, anywhere in the world.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-8 group">
              <div className="mb-4 p-4 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Secure & Verified</h3>
              <p className="text-muted-foreground">
                Every upload is verified. Watermarking and secure download links protect your intellectual property.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-8 group">
              <div className="mb-4 p-4 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Curated Quality</h3>
              <p className="text-muted-foreground">
                We prioritize quality over quantity. Find the perfect shot without digging through trash.
              </p>
            </SpotlightCard>
          </div>
        </section>

        <CategorySection />
      </div>

      {/* Spacer to allow scrolling past content to reveal footer */}
      <div className="bg-background"></div>
    </main>
  );
}

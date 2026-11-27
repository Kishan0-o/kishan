import { Suspense } from "react";
import MouseMoveEffect from "@/components/mouse-move-effect";
import Hero from "@/components/hero";
import GlassmorphismCard from "@/components/glassmorphism-card";
import ProjectGrid from "@/components/project-grid";
import {
  getMergedProjects,
  getCategoriesWithCountFromProjects,
} from "@/lib/helper";

export default async function HomePage() {
  // Fetch all local video projects on the server
  const allProjects = await getMergedProjects();
  const categories = getCategoriesWithCountFromProjects(allProjects);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MouseMoveEffect />

      <Hero />

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6">
        <div className="max-w-[1380px] mx-auto">
          <div className="text-center mb-16 relative">
            {/* Spotlight Effect behind title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight relative z-10">
              <span className="bg-gradient-to-r from-white via-blue-100 to-gray-400 bg-clip-text text-transparent">
                Selected Work
              </span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Selected edits across <span className="text-white font-medium">UGC &amp; DTC Ads</span>,{" "}
              <span className="text-white font-medium">Social Media</span>,{" "}
              <span className="text-white font-medium">A/B Testing</span>,{" "}
              <span className="text-white font-medium">Product Showcase</span>, and{" "}
              <span className="text-white font-medium">Brand Promos</span>.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading videos...</div>}>
            <ProjectGrid initialCategories={categories} initialProjects={allProjects} />
          </Suspense>
        </div>
      </section>

      {/* What I Can Do Section */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              What I Can Do <span className="text-blue-500">for You</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              If you&apos;re looking for someone who blends creativity with technical
              skill, communicates clearly, and truly cares about results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "YouTube & Shorts Editing",
                description: "Engaging edits optimized for retention with perfect pacing and retention hooks.",
                icon: "🎬",
              },
              {
                title: "DTC & Performance Ads",
                description: "High-converting UGC ads, hook-driven testimonials, and kinetic typography.",
                icon: "📈",
              },
              {
                title: "Luxury Brand Promos",
                description: "Cinematic boutique lookbooks, fashion edits, beat-synced rhythm and color grade.",
                icon: "✨",
              },
            ].map((skill, index) => (
              <GlassmorphismCard key={index} className="p-6">
                <div className="text-4xl mb-4">{skill.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {skill.title}
                </h3>
                <p className="text-gray-400">{skill.description}</p>
              </GlassmorphismCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

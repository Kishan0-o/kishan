"use client";

import { m } from "framer-motion";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import CTASection from "@/components/CTASection";
import {
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Clock,
  Zap
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center pt-32 pb-12 md:py-24 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold mt-0 md:mt-20 mb-3 text-white tracking-tight">
            Behind the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Timeline</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Visual Storyteller. Motion Graphics Artist. Problem Solver.
          </p>
        </m.div>

        <BentoGrid className="max-w-6xl mx-auto mb-20">
          {/* 1. Hero Profile */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 md:row-span-2"
          >
            <BentoGridItem
              title=""
              description=""
              header={
                <div className="relative w-full h-full min-h-[28rem] md:min-h-[16rem] rounded-xl overflow-hidden group-hover/bento:scale-[1.02] transition-transform duration-500">
                  <Image
                    src="/Kishan.jpg"
                    alt="Kishan Kumar"
                    fill
                    className="object-cover object-top grayscale-[0] hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                  {/* Name Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <m.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter"
                    >
                      KISHAN<br />
                      <span className="text-blue-500">KUMAR</span>
                    </m.div>
                    <div className="h-1 w-16 md:w-20 bg-purple-500 mt-4 rounded-full" />
                    <p className="text-gray-300 mt-4 text-xs md:text-sm font-medium tracking-wide uppercase">
                      Professional Motion Designer & Graphic Designer
                    </p>
                  </div>
                </div>
              }
              className="h-full shadow-2xl shadow-blue-900/10"
              icon={null}
            />
          </m.div>

          {/* 2. Stats - Experience */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1"
          >
            <BentoGridItem
              title="Experience"
              description="Years of professional grinding."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-black to-neutral-900 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-emerald-500/30 transition-colors py-8 md:py-0">
                  <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />
                  <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-900 z-10">2+</span>
                  <div className="text-emerald-500/50 text-xs font-mono uppercase tracking-[0.2em] z-10 mt-2">Years Active</div>
                </div>
              }
              className="h-full"
              icon={<Clock className="h-4 w-4 text-emerald-500" />}
            />
          </m.div>

          {/* 3. Global Reach */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-1"
          >
            <BentoGridItem
              title="Global Reach"
              description="Remote ready."
              header={
                <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-black overflow-hidden flex items-center justify-center border border-white/5">
                  <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center animate-pulse">
                      <MapPin className="text-blue-500" size={32} />
                    </div>
                    <div className="mt-2 bg-blue-500/20 backdrop-blur text-blue-300 px-3 py-1 rounded text-xs font-bold border border-blue-500/30">
                      WORLDWIDE
                    </div>
                  </div>
                </div>
              }
              className="h-full"
              icon={<MapPin className="h-4 w-4 text-indigo-500" />}
            />
          </m.div>

          {/* 4. Socials */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-1"
          >
            <BentoGridItem
              title="Connect"
              description="Let's stay in touch."
              header={
                <div className="flex flex-1 h-full w-full items-center justify-between px-6 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl border border-white/5 py-4 md:py-0 min-h-[5rem]">
                  <a href="https://www.linkedin.com/in/kishan--/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-[#0077b5] hover:scale-110 transition-all duration-300 text-white"><Linkedin size={20} /></a>
                  <a href="https://www.instagram.com/kishan0_o" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-pink-600 hover:scale-110 transition-all duration-300 text-white"><Instagram size={20} /></a>
                  <a href="https://www.youtube.com/@vfxlyrical" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-300 text-white"><Youtube size={20} /></a>
                </div>
              }
              className="h-full"
              icon={<Zap className="h-4 w-4 text-white" />}
            />
          </m.div>
        </BentoGrid>

        <CTASection
          title="Ready to Work Together?"
          description="Let's make something that breaks the internet."
          buttonText="Start Collaboration"
          href="/contact"
        />
      </div>
    </div>
  );
}

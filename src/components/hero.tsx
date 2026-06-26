"use client";

import { m } from "framer-motion";
import { ArrowDown } from "lucide-react";
import MagneticButton from "./magnetic-button";
import { useLenis } from "lenis/react";
import { useMobile } from "@/hooks/use-mobile";

export default function Hero() {
    const lenis = useLenis();
    const isMobile = useMobile();

    const scrollToProjects = (e?: React.MouseEvent) => {
        e?.preventDefault();
        if (lenis) {
            lenis.scrollTo("#projects", {
                duration: 2,
                offset: -100,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        } else {
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Lighter animations on mobile
    const titleAnimation = isMobile
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 } }
        : { initial: { opacity: 0, y: 60, filter: "blur(10px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: { duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.1 } };

    const subtitleAnimation = isMobile
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: 0.2 } }
        : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.6, ease: [0.25, 1, 0.5, 1] } };

    return (
        <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
            {/* Background Ambience - Reduced blur on mobile for performance */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-blue-900/15 rounded-[100%] ${isMobile ? "blur-[60px]" : "blur-[120px] animate-pulse-slow"}`} />
                {!isMobile && (
                    <>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
                        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]" />
                    </>
                )}
            </div>

            <div className="relative z-10 text-center px-4 md:px-8 max-w-6xl mx-auto w-full">
                {/* Badge */}
                <m.div
                    initial={{ opacity: 0, y: isMobile ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: isMobile ? 0.4 : 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className="inline-block mb-8 md:mb-10 w-full"
                >
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-xs sm:text-sm font-medium text-blue-300 tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.15)] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 animate-pulse" />
                        Available for Hire
                    </div>
                </m.div>

                {/* Main Title */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.9] w-full flex flex-col items-center">
                    <m.span
                        {...titleAnimation}
                        className="block w-full bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-sm pb-2"
                    >
                        MOTION
                    </m.span>
                    <m.span
                        initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={isMobile ? { duration: 0.4, delay: 0.1 } : { duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                        className="block w-full text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 pb-4"
                    >
                        DESIGNER
                    </m.span>
                </h1>

                {/* Subtitle */}
                <m.p
                    {...subtitleAnimation}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-12 sm:mb-16 md:px-0"
                >
                    Turning raw footage into visual stories — with style, precision, and a touch of{" "}
                    <span className="text-white font-medium">cinematic magic</span>.
                </m.p>

                {/* Buttons */}
                <m.div
                    initial={{ opacity: 0, y: isMobile ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: isMobile ? 0.4 : 0.8, delay: isMobile ? 0.3 : 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto sm:max-w-none"
                >
                    {isMobile ? (
                        // Plain buttons on mobile — no MagneticButton (requires mouse tracking)
                        <>
                            <a
                                href="#projects"
                                onClick={scrollToProjects}
                                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 sm:px-10 py-4 text-base sm:text-lg font-semibold text-black bg-white rounded-full transition-all duration-300 active:scale-95"
                            >
                                View Work
                            </a>
                            <a
                                href="/contact"
                                className="group inline-flex items-center justify-center w-full sm:w-auto px-8 sm:px-10 py-4 text-base sm:text-lg font-medium text-white bg-white/5 border border-white/10 rounded-full transition-all duration-300 active:scale-95"
                            >
                                Contact Me
                            </a>
                        </>
                    ) : (
                        <>
                            <MagneticButton>
                                <a
                                    href="#projects"
                                    onClick={scrollToProjects}
                                    className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 sm:px-10 py-4 text-base sm:text-lg font-semibold text-black bg-white rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] cursor-pointer"
                                >
                                    <span className="relative z-10 flex items-center">View Work</span>
                                </a>
                            </MagneticButton>
                            <MagneticButton>
                                <a
                                    href="/contact"
                                    className="group inline-flex items-center justify-center w-full sm:w-auto px-8 sm:px-10 py-4 text-base sm:text-lg font-medium text-white bg-white/5 border border-white/10 rounded-full backdrop-blur-2xl transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                >
                                    Contact Me
                                </a>
                            </MagneticButton>
                        </>
                    )}
                </m.div>
            </div>

            {/* Scroll Indicator */}
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isMobile ? 0.8 : 1.5, duration: isMobile ? 0.5 : 1.5 }}
                className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2"
            >
                <button
                    onClick={scrollToProjects}
                    className="flex flex-col items-center gap-3 text-white/40 hover:text-white transition-colors duration-500"
                >
                    <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-medium">Scroll</span>
                    <ArrowDown className="animate-bounce" size={18} strokeWidth={1.5} />
                </button>
            </m.div>
        </section>
    );
}

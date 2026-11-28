"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Midnight Liquid Glass - Background Engine
 * Creates a dual-layer parallax gradient effect that reacts to mouse movement.
 * Layer 1: Neon Blue (Primary) - Follows closely
 * Layer 2: Neon Purple (Secondary) - Follows with lag/parallax
 */
export default function MouseMoveEffect() {
  const requestRef = useRef<number>(0);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos1 = useRef({ x: 0, y: 0 }); // Layer 1 position
  const currentPos2 = useRef({ x: 0, y: 0 }); // Layer 2 position

  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // 1. Check if mobile/touch device
    const checkMobile = () => {
      const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      setIsMobile(isTouch);

      if (typeof window !== 'undefined') {
        // Initialize center
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        targetPos.current = { x: cx, y: cy };
        currentPos1.current = { x: cx, y: cy };
        currentPos2.current = { x: cx, y: cy };
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    let running = false;

    const animate = () => {
      if (!layer1Ref.current || !layer2Ref.current) {
        running = false;
        return;
      }

      const ease1 = 0.08;
      const ease2 = 0.04;

      const dx1 = targetPos.current.x - currentPos1.current.x;
      const dy1 = targetPos.current.y - currentPos1.current.y;
      const dx2 = targetPos.current.x - currentPos2.current.x;
      const dy2 = targetPos.current.y - currentPos2.current.y;

      currentPos1.current.x += dx1 * ease1;
      currentPos1.current.y += dy1 * ease1;
      currentPos2.current.x += dx2 * ease2;
      currentPos2.current.y += dy2 * ease2;

      layer1Ref.current.style.transform = `translate3d(${currentPos1.current.x - 400}px, ${currentPos1.current.y - 400}px, 0)`;
      layer2Ref.current.style.transform = `translate3d(${currentPos2.current.x - 300}px, ${currentPos2.current.y - 300}px, 0)`;

      // Stop rAF loop once both layers have settled near the cursor
      if (
        Math.abs(dx1) < 0.5 &&
        Math.abs(dy1) < 0.5 &&
        Math.abs(dx2) < 0.5 &&
        Math.abs(dy2) < 0.5
      ) {
        running = false;
        return;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    const startAnimate = () => {
      if (!running && !isMobile) {
        running = true;
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      targetPos.current = {
        x: event.clientX,
        y: event.clientY,
      };
      startAnimate();
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      startAnimate();
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile]);

  // If mobile, render static gradient or nothing to save GPU
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-900/10 blur-[60px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-purple-900/10 blur-[60px]" />
      </div>
    );
  }

  return (
    <>
      {/* Base Ambient Glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.1) 0%, transparent 70%)'
        }}
      />

      {/* Layer 1 (GPU transform-only, zero background repaints) */}
      <div
        ref={layer1Ref}
        className="pointer-events-none fixed top-0 left-0 w-[800px] h-[800px] z-0 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(29, 78, 216, 0.12) 0%, transparent 60%)'
        }}
      />

      {/* Layer 2 (GPU transform-only, zero background repaints) */}
      <div
        ref={layer2Ref}
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] z-0 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 60%)'
        }}
      />
    </>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";

export default function MouseMoveEffect() {
  const requestRef = useRef<number>(0);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos1 = useRef({ x: 0, y: 0 });
  const currentPos2 = useRef({ x: 0, y: 0 });

  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      setIsMobile(isTouch);

      if (typeof window !== "undefined") {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        targetPos.current = { x: cx, y: cy };
        currentPos1.current = { x: cx, y: cy };
        currentPos2.current = { x: cx, y: cy };
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (event: MouseEvent) => {
      targetPos.current = { x: event.clientX, y: event.clientY };
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    const animate = () => {
      if (!layer1Ref.current || !layer2Ref.current) return;

      const ease1 = 0.08;
      const ease2 = 0.04;

      currentPos1.current.x += (targetPos.current.x - currentPos1.current.x) * ease1;
      currentPos1.current.y += (targetPos.current.y - currentPos1.current.y) * ease1;
      currentPos2.current.x += (targetPos.current.x - currentPos2.current.x) * ease2;
      currentPos2.current.y += (targetPos.current.y - currentPos2.current.y) * ease2;

      const p1 = currentPos1.current;
      const p2 = currentPos2.current;

      layer1Ref.current.style.background = `radial-gradient(800px circle at ${p1.x}px ${p1.y}px, rgba(29, 78, 216, 0.12), transparent 60%)`;
      layer2Ref.current.style.background = `radial-gradient(600px circle at ${p2.x}px ${p2.y}px, rgba(147, 51, 234, 0.08), transparent 60%)`;

      requestRef.current = requestAnimationFrame(animate);
    };

    if (!isMobile) {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile]);

  // On mobile: simple static gradient, NO animation, NO heavy blur
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-blue-900/8 blur-[60px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full bg-purple-900/8 blur-[60px]" />
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.1) 0%, transparent 70%)" }}
      />
      <div ref={layer1Ref} className="pointer-events-none fixed inset-0 z-0 will-change-[background]" />
      <div ref={layer2Ref} className="pointer-events-none fixed inset-0 z-0 will-change-[background]" />
    </>
  );
}

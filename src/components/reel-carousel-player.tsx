"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MoveRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { VideoVariation } from "@/types/videos";

interface ReelCarouselPlayerProps {
  projectId: string;
  title: string;
  variations: VideoVariation[];
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
  isMuted: boolean;
  onToggleMute: (e: React.MouseEvent) => void;
  isHovered?: boolean;
  captionExpanded?: boolean;
  onDismissExpanded?: () => void;
  onUserPlayIntent?: () => boolean;
  playbackRate?: number;
  variant?: "card" | "detail";
  onProgressChange?: (pct: number, currentSec: number, durationSec: number) => void;
  onActiveVideoRef?: (el: HTMLVideoElement | null) => void;
}

/**
 * Shared 9:16 Instagram/Reels-style horizontal swipe & drag video carousel.
 * Supports single-slide videos or multi-hook A/B variations seamlessly.
 */
export default function ReelCarouselPlayer({
  projectId,
  title,
  variations,
  isPlaying,
  onPlayingChange,
  isMuted,
  onToggleMute,
  isHovered = false,
  captionExpanded = false,
  onDismissExpanded,
  onUserPlayIntent,
  playbackRate = 1,
  variant = "card",
  onProgressChange,
  onActiveVideoRef,
}: ReelCarouselPlayerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startedSlides, setStartedSlides] = useState<Record<number, boolean>>({});
  const [landscapeSlides, setLandscapeSlides] = useState<Record<number, boolean>>({});

  const trackWrapRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const pendingAutoPlayRef = useRef(false);
  const suppressClickRef = useRef(false);

  const latestRef = useRef({
    projectId,
    isMuted,
    playbackRate,
    onPlayingChange,
    onUserPlayIntent,
    onProgressChange,
    onActiveVideoRef,
  });
  latestRef.current = {
    projectId,
    isMuted,
    playbackRate,
    onPlayingChange,
    onUserPlayIntent,
    onProgressChange,
    onActiveVideoRef,
  };

  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    lockedAxis: "x" | "y" | null;
    didDrag: boolean;
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lockedAxis: null,
    didDrag: false,
  });

  const totalSlides = variations.length;
  const isMulti = totalSlides > 1;
  const activeVariation = variations[activeIndex] ?? variations[0];

  // Expose active video ref up to parent
  useEffect(() => {
    latestRef.current.onActiveVideoRef?.(videoRefs.current[activeIndex] ?? null);
  }, [activeIndex]);

  // Apply playbackRate whenever rate or active slide changes
  useEffect(() => {
    const activeVid = videoRefs.current[activeIndex];
    if (activeVid) {
      activeVid.playbackRate = playbackRate;
    }
  }, [activeIndex, playbackRate]);

  // Handle slide switches: pause & reset inactive slides, auto-start new slide on swipe
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx !== activeIndex) {
        vid.pause();
        vid.currentTime = 0;
      }
    });

    const activeVid = videoRefs.current[activeIndex];
    if (!activeVid) return;

    if (pendingAutoPlayRef.current) {
      pendingAutoPlayRef.current = false;
      const effectiveMuted = latestRef.current.onUserPlayIntent
        ? latestRef.current.onUserPlayIntent()
        : latestRef.current.isMuted;

      window.dispatchEvent(
        new CustomEvent("kishan-reel-play", {
          detail: latestRef.current.projectId,
        })
      );
      setStartedSlides((prev) => ({ ...prev, [activeIndex]: true }));
      latestRef.current.onPlayingChange(true);

      activeVid.currentTime = 0;
      activeVid.playbackRate = latestRef.current.playbackRate;
      activeVid.muted = effectiveMuted;
      activeVid.play().catch(() => {
        activeVid.muted = true;
        activeVid.play().catch(() => {
          latestRef.current.onPlayingChange(false);
        });
      });
    }
  }, [activeIndex]);

  // Keep active slide aligned with isPlaying & isMuted state
  useEffect(() => {
    const activeVid = videoRefs.current[activeIndex];
    if (!activeVid) return;

    activeVid.muted = isMuted;
    if (isPlaying) {
      setStartedSlides((prev) =>
        prev[activeIndex] ? prev : { ...prev, [activeIndex]: true }
      );
      if (activeVid.paused) {
        activeVid.play().catch(() => {});
      }
    } else if (!activeVid.paused) {
      activeVid.pause();
    }
  }, [isPlaying, isMuted, activeIndex]);

  const goToSlide = useCallback(
    (nextIndex: number, autoPlay = true) => {
      const clamped = Math.max(0, Math.min(totalSlides - 1, nextIndex));
      if (clamped === activeIndex) return;

      setHasSwiped(true);
      pendingAutoPlayRef.current = autoPlay;
      latestRef.current.onProgressChange?.(0, 0, 0);

      const currentVid = videoRefs.current[activeIndex];
      if (currentVid) {
        currentVid.pause();
        currentVid.currentTime = 0;
      }

      setActiveIndex(clamped);
    },
    [activeIndex, totalSlides]
  );

  const handleCanvasTogglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        return;
      }

      if (captionExpanded && onDismissExpanded) {
        onDismissExpanded();
        return;
      }

      if (!isPlaying) {
        window.dispatchEvent(
          new CustomEvent("kishan-reel-play", { detail: projectId })
        );
        onUserPlayIntent?.();
        setStartedSlides((prev) => ({ ...prev, [activeIndex]: true }));
        onPlayingChange(true);
      } else {
        onPlayingChange(false);
      }
    },
    [
      captionExpanded,
      onDismissExpanded,
      isPlaying,
      projectId,
      onUserPlayIntent,
      activeIndex,
      onPlayingChange,
    ]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMulti) return;
    if ((e.target as HTMLElement).closest("button, a, [data-no-drag]")) return;

    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lockedAxis: null,
      didDrag: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragStateRef.current;
    if (!st.active || st.pointerId !== e.pointerId) return;

    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;

    if (!st.lockedAxis) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
        st.lockedAxis = "y";
        st.active = false;
        setIsDragging(false);
        setDragOffset(0);
        return;
      }
      if (Math.abs(dx) > 8) {
        st.lockedAxis = "x";
        st.didDrag = true;
        setIsDragging(true);
        e.currentTarget.setPointerCapture?.(e.pointerId);
      }
    }

    if (st.lockedAxis === "x") {
      const atLeftEdge = activeIndex === 0 && dx > 0;
      const atRightEdge = activeIndex === totalSlides - 1 && dx < 0;
      setDragOffset(atLeftEdge || atRightEdge ? dx * 0.28 : dx);
    }
  };

  const finishPointerDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragStateRef.current;
    if (!st.active || st.pointerId !== e.pointerId) return;

    const dx = e.clientX - st.startX;
    const wasHorizontal = st.lockedAxis === "x" && st.didDrag;

    st.active = false;
    st.pointerId = null;
    st.lockedAxis = null;
    setIsDragging(false);
    setDragOffset(0);

    if (wasHorizontal) {
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 60);

      const width = trackWrapRef.current?.clientWidth || 300;
      const threshold = Math.min(48, width * 0.16);
      if (dx < -threshold && activeIndex < totalSlides - 1) {
        goToSlide(activeIndex + 1, true);
      } else if (dx > threshold && activeIndex > 0) {
        goToSlide(activeIndex - 1, true);
      }
    }
  };

  return (
    <div
      ref={trackWrapRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerDrag}
      onPointerCancel={finishPointerDrag}
      onClick={handleCanvasTogglePlay}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full h-full overflow-hidden touch-pan-y select-none ${
        isMulti ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      }`}
    >
      {/* Horizontal Sliding Variations Track */}
      <div
        style={{
          transform: `translate3d(calc(-${activeIndex * 100}% + ${dragOffset}px), 0, 0)`,
        }}
        className={`flex w-full h-full ${
          isDragging ? "transition-none" : "transition-transform duration-300 ease-out"
        }`}
      >
        {variations.map((item, idx) => {
          const thumbSrc = item.cover_image.startsWith("/")
            ? item.cover_image
            : `https://img.youtube.com/vi/${item.cover_image}/maxresdefault.jpg`;
          const isLocal =
            item.video_link.startsWith("/") || item.video_link.endsWith(".mp4");
          const isActiveSlide = idx === activeIndex;
          const slideStarted = Boolean(startedSlides[idx]);
          const fitClass = landscapeSlides[idx] ? "object-contain" : "object-cover";

          return (
            <div
              key={item.id || idx}
              className="relative w-full h-full shrink-0 overflow-hidden bg-black"
            >
              <Image
                src={thumbSrc}
                alt={`${title}${item.label ? ` — ${item.label}` : ""}`}
                fill
                draggable={false}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth > img.naturalHeight) {
                    setLandscapeSlides((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
                  }
                }}
                className={`${fitClass} pointer-events-none`}
                sizes={
                  variant === "detail"
                    ? "(max-width: 768px) 100vw, 448px"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                }
              />

              {isLocal ? (
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={item.video_link}
                  poster={thumbSrc}
                  loop
                  playsInline
                  muted={isMuted}
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  preload="metadata"
                  onTimeUpdate={(e) => {
                    if (!isActiveSlide) return;
                    const v = e.currentTarget;
                    if (v.duration) {
                      latestRef.current.onProgressChange?.(
                        (v.currentTime / v.duration) * 100,
                        v.currentTime,
                        v.duration
                      );
                    }
                  }}
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    if (v.videoWidth > v.videoHeight) {
                      setLandscapeSlides((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
                    }
                    if (!isActiveSlide) return;
                    if (v.duration) {
                      latestRef.current.onProgressChange?.(
                        (v.currentTime / v.duration) * 100,
                        v.currentTime,
                        v.duration
                      );
                    }
                  }}
                  className={`absolute inset-0 w-full h-full ${fitClass} ${
                    slideStarted && isActiveSlide ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : (
                isActiveSlide &&
                isPlaying && (
                  <iframe
                    src={`https://www.youtube.com/embed/${item.cover_image}?autoplay=1&controls=0&rel=0&modestbranding=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0 z-10"
                  />
                )
              )}
            </div>
          );
        })}
      </div>

      {/* Multi-Hook Slide Indicator Badge (e.g. Hook 01 · 1/4) */}
      {isMulti && (
        <div
          data-no-drag
          className={`absolute z-30 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white shadow-md ${
            variant === "detail" ? "top-3.5 right-3.5" : "top-3 right-11"
          }`}
        >
          {activeVariation?.label && <span>{activeVariation.label}</span>}
          <span className="text-white/60 tabular-nums">
            {activeIndex + 1}/{totalSlides}
          </span>
        </div>
      )}

      {/* Desktop Arrow Navigation Buttons */}
      {isMulti && activeIndex > 0 && !captionExpanded && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            goToSlide(activeIndex - 1, true);
          }}
          aria-label="Previous hook variation"
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 text-white flex items-center justify-center shadow-lg transition-opacity duration-200 cursor-pointer ${
            variant === "detail" || isHovered
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {isMulti && activeIndex < totalSlides - 1 && !captionExpanded && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            goToSlide(activeIndex + 1, true);
          }}
          aria-label="Next hook variation"
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 text-white flex items-center justify-center shadow-lg transition-opacity duration-200 cursor-pointer ${
            variant === "detail" || isHovered
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Centered Stacked Instagram Playback Controls (Mute above Play/Pause) */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 pointer-events-none transition-opacity duration-200 ${
          captionExpanded
            ? "opacity-0"
            : !isPlaying
            ? "opacity-100"
            : isHovered
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className={`${
            captionExpanded ? "pointer-events-none" : "pointer-events-auto"
          } w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer`}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        <button
          type="button"
          onClick={handleCanvasTogglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className={`${
            captionExpanded ? "pointer-events-none" : "pointer-events-auto"
          } w-14 h-14 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/15 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer`}
        >
          {isPlaying ? (
            <Pause size={24} className="fill-white" />
          ) : (
            <Play size={24} className="fill-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Subtle Initial Swipe Prompt Animation (Slide 1 only, disappears once user interacts) */}
      {isMulti && activeIndex === 0 && !hasSwiped && !captionExpanded && (
        <div
          data-no-drag
          className={`absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white/95 shadow-lg whitespace-nowrap ${
            variant === "detail" ? "bottom-[98px]" : "bottom-[104px]"
          }`}
        >
          <span>Swipe for Hook 02</span>
          <m.span
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.35, ease: "easeInOut" }}
            className="inline-flex items-center"
          >
            <MoveRight size={13} />
          </m.span>
        </div>
      )}

      {/* Instagram-style Pagination Dots (Centered cleanly above bottom bar) */}
      {isMulti && !captionExpanded && (
        <div
          data-no-drag
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.45)] ${
            variant === "detail" ? "bottom-[66px]" : "bottom-[76px]"
          }`}
          role="tablist"
          aria-label="Hook variations"
        >
          {variations.map((item, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={item.id || idx}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show ${item.label || `variation ${idx + 1}`}`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  goToSlide(idx, true);
                }}
                className={`rounded-full transition-all duration-200 cursor-pointer ${
                  active
                    ? "w-2 h-1.5 bg-white shadow-sm"
                    : "w-1.5 h-1.5 bg-white/45 hover:bg-white/75"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

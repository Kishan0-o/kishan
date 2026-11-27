"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import DeleteProjectButton from "@/components/delete-project-button";
import InstagramActionRail from "@/components/instagram-action-rail";
import ReelCarouselPlayer from "@/components/reel-carousel-player";
import { VideoProject, VideoVariation } from "@/types/videos";

interface ProjectCardProps {
  project: VideoProject;
  activeCategory?: string;
}

function getReelTag(categories: string[], activeCategory?: string): string {
  if (activeCategory === "Featured") return "Featured";
  if (activeCategory === "A/B Testing") return "A/B Test";
  if (activeCategory === "Product Showcase") return "Product Showcase";
  if (activeCategory === "Brand Promos") return "Promo";
  if (activeCategory === "Social Media") return "Social Media";
  if (activeCategory === "UGC & DTC Ads") return "UGC Ad";
  if (categories.includes("Featured")) return "Featured";
  if (categories.includes("A/B Testing")) return "A/B Test";
  if (categories.includes("Product Showcase")) return "Product Showcase";
  if (categories.includes("Brand Promos")) return "Promo";
  if (categories.includes("UGC & DTC Ads")) return "UGC Ad";
  if (categories.includes("Social Media")) return "Social Media";
  return "Reel";
}

export default function ProjectCard({
  project,
  activeCategory,
}: ProjectCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasUserUnmutedOrMuted, setHasUserUnmutedOrMuted] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hideControls, setHideControls] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const explicitMuteRef = useRef({ hasSet: false, isMuted: true });
  explicitMuteRef.current = {
    hasSet: hasUserUnmutedOrMuted,
    isMuted,
  };

  const variations: VideoVariation[] = useMemo(() => {
    if (project.variations && project.variations.length > 0) {
      return project.variations;
    }
    return [
      {
        id: project.id,
        label: "",
        video_link: project.video_link,
        cover_image: project.cover_image,
        duration: project.duration,
      },
    ];
  }, [project]);

  const reelTag = useMemo(
    () => getReelTag(project.category, activeCategory),
    [project.category, activeCategory]
  );

  // Pause this card when another card in the grid starts playing
  useEffect(() => {
    const handleOtherReelPlay = (event: Event) => {
      const custom = event as CustomEvent<string>;
      if (custom.detail !== project.id && isPlaying) {
        setIsPlaying(false);
      }
    };

    window.addEventListener("kishan-reel-play", handleOtherReelPlay);
    return () => {
      window.removeEventListener("kishan-reel-play", handleOtherReelPlay);
    };
  }, [project.id, isPlaying]);

  // Close expanded caption/comments overlay on click outside overlay or Escape key
  useEffect(() => {
    if (!captionExpanded) return;

    const handlePointerOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setCaptionExpanded(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCaptionExpanded(false);
      }
    };

    document.addEventListener("mousedown", handlePointerOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [captionExpanded]);

  // Automatically fade out Like, Comment, Share, and Avatar/Brand controls 5s after playback begins
  useEffect(() => {
    if (!isPlaying || captionExpanded) {
      setHideControls(false);
      return;
    }

    setHideControls(false);
    const timer = setTimeout(() => {
      setHideControls(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isPlaying, captionExpanded]);

  const handleUserPlayIntent = useCallback(() => {
    if (!explicitMuteRef.current.hasSet) {
      setIsMuted(false);
      return false;
    }
    return explicitMuteRef.current.isMuted;
  }, []);

  const handleToggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setHasUserUnmutedOrMuted(true);
    setIsMuted((prev) => !prev);
  }, []);

  const handleProgressChange = useCallback((pct: number) => {
    setProgress(pct);
  }, []);

  const handleActiveVideoRef = useCallback((el: HTMLVideoElement | null) => {
    activeVideoRef.current = el;
  }, []);

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const vid = activeVideoRef.current;
    if (!vid || !vid.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    vid.currentTime = ratio * vid.duration;
    setProgress(ratio * 100);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black isolate group select-none transition-all duration-300 border border-white/10 hover:border-white/25 shadow-xl shadow-black/40"
    >
      {/* 9:16 Single / Carousel Reel Player */}
      <div className="absolute inset-0 w-full h-full">
        <ReelCarouselPlayer
          projectId={project.id}
          title={project.video_title}
          variations={variations}
          isPlaying={isPlaying}
          onPlayingChange={setIsPlaying}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isHovered={isHovered}
          captionExpanded={captionExpanded}
          onDismissExpanded={() => setCaptionExpanded(false)}
          onUserPlayIntent={handleUserPlayIntent}
          variant="card"
          onProgressChange={handleProgressChange}
          onActiveVideoRef={handleActiveVideoRef}
        />
      </div>

      {/* Top-Right: Hover Delete Button */}
      <div className="absolute top-3 right-3 z-30 flex items-center">
        <DeleteProjectButton
          projectId={project.id}
          projectTitle={project.video_title}
          className="p-1.5 rounded-full bg-black/55 backdrop-blur-md text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all duration-200"
        />
      </div>

      {/* Right-Side Action Rail (Fades out 5s after playback begins) */}
      <div className="absolute right-2.5 bottom-[72px] z-20">
        <InstagramActionRail
          projectId={project.id}
          onCommentClick={() => setCaptionExpanded((v) => !v)}
          hidden={hideControls || captionExpanded}
        />
      </div>

      {/* Bottom Instagram Gradient Overlay (Avatar + Client/Brand + Details + Caption / ...more + Tag) */}
      <div
        ref={overlayRef}
        onClick={(e) => e.stopPropagation()}
        className={`absolute inset-x-0 bottom-0 px-3.5 pb-3.5 transition-all duration-500 ${
          captionExpanded
            ? "z-30 pt-4 bg-gradient-to-t from-black/95 via-black/92 to-black/80 backdrop-blur-md border-t border-white/10"
            : "z-20 pt-14 bg-gradient-to-t from-black/90 via-black/55 to-transparent"
        } ${
          hideControls
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        {/* Row 1: Clean Circular Avatar + Brand/Client Name + Details Pill */}
        <div
          className={`flex items-center justify-between gap-2 mb-2 ${
            captionExpanded ? "pr-0" : "pr-10"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 bg-black shrink-0">
              <Image
                src={project.client_image || "/placeholder.svg"}
                alt={project.client_name}
                width={28}
                height={28}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <span className="text-[13px] font-semibold text-white truncate max-w-[115px] drop-shadow-sm">
              {project.client_name}
            </span>

            <Link
              href={`/project/${project.id}`}
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-0.5 rounded-md border border-white/45 hover:border-white hover:bg-white/15 text-[11px] font-semibold text-white transition-colors shrink-0"
            >
              Details
            </Link>
          </div>

          {captionExpanded && (
            <button
              type="button"
              onClick={() => setCaptionExpanded(false)}
              aria-label="Close overlay"
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Row 2: Caption (Single-line Title + ...more inline expand) + Bottom-Right Tag */}
        <AnimatePresence mode="wait">
          {captionExpanded ? (
            <m.div
              key="expanded-caption"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
              className="space-y-1.5"
            >
              <div className="max-h-[190px] overflow-y-auto pr-2 space-y-1.5 text-xs">
                <p className="font-semibold text-white leading-snug">
                  {project.video_title}
                </p>
                {project.video_description && (
                  <p className="text-[11px] text-gray-300 leading-relaxed whitespace-pre-line">
                    {project.video_description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={() => setCaptionExpanded(false)}
                  className="text-[11px] font-medium text-gray-400 hover:text-white cursor-pointer"
                >
                  ...less
                </button>
                <span className="text-[11px] font-medium text-gray-400">
                  {reelTag}
                </span>
              </div>
            </m.div>
          ) : (
            <div
              key="collapsed-caption"
              className="flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center min-w-0 flex-1 pr-2">
                <span className="truncate text-white/95 text-[12px]">
                  {project.video_title}
                </span>
                <button
                  type="button"
                  onClick={() => setCaptionExpanded(true)}
                  className="text-gray-400 hover:text-white text-[12px] font-medium shrink-0 ml-1 cursor-pointer"
                >
                  ...more
                </button>
              </div>

              <span className="text-[11px] font-medium text-gray-400 shrink-0">
                {reelTag}
              </span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Hairline Instagram Reel Progress Scrubber at Very Bottom */}
      <div
        data-no-drag
        onClick={handleScrub}
        title="Click to seek"
        className="absolute inset-x-0 bottom-0 h-[4px] bg-white/15 z-30 cursor-pointer group/bar"
      >
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-white/90 group-hover/bar:bg-white transition-[width] duration-75"
        />
      </div>
    </div>
  );
}

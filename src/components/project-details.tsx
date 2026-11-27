"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GlassmorphismCard from "@/components/glassmorphism-card";
import ReelCarouselPlayer from "@/components/reel-carousel-player";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Clock,
  Calendar,
} from "lucide-react";
import type { VideoProject, VideoVariation } from "@/types/videos";

interface ProjectDetailsProps {
  project: VideoProject;
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const total = Math.floor(sec);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const playerWrapRef = useRef<HTMLDivElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

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

  // Attempt initial unmuted playback cleanly on mount; pause cleanly if browser blocks autoplay
  useEffect(() => {
    const vid = activeVideoRef.current;
    if (!vid) return;
    vid.play().catch(() => {
      setIsPlaying(false);
    });
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((p) => !p);
  };

  const handleToggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((mState) => !mState);
  }, []);

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rates = [1, 1.25, 1.5, 2];
    const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(next);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wrap = playerWrapRef.current;
    if (!wrap) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      wrap.requestFullscreen?.().catch(() => {});
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const vid = activeVideoRef.current;
    if (!vid || !vid.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    vid.currentTime = ratio * vid.duration;
    setCurrentTime(vid.currentTime);
    setProgressPct(ratio * 100);
  };

  const handleProgressChange = useCallback(
    (pct: number, curSec: number, durSec: number) => {
      setProgressPct(pct);
      setCurrentTime(curSec);
      setDuration(durSec);
    },
    []
  );

  const handleActiveVideoRef = useCallback((el: HTMLVideoElement | null) => {
    activeVideoRef.current = el;
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              asChild
              variant="outline"
              className="pl-4 pr-6 py-2 h-auto text-sm font-medium text-white bg-white/5 border border-white/10 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl group"
            >
              <Link href="/">
                <ArrowLeft className="mr-2" size={16} />
                Back to Portfolio
              </Link>
            </Button>
          </m.div>
        </div>

        {/* 9:16 Video / A/B Hook Carousel Player Section (zero download menu) */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <GlassmorphismCard className="p-4 sm:p-6">
            <div
              ref={playerWrapRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onContextMenu={(e) => e.preventDefault()}
              className="max-w-md mx-auto aspect-[9/16] relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 group select-none"
            >
              <ReelCarouselPlayer
                projectId={project.id}
                title={project.video_title}
                variations={variations}
                isPlaying={isPlaying}
                onPlayingChange={setIsPlaying}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                isHovered={isHovered}
                playbackRate={playbackRate}
                variant="detail"
                onProgressChange={handleProgressChange}
                onActiveVideoRef={handleActiveVideoRef}
              />

              {/* Custom Bottom Controls Bar (no download option / no 3-dot menu) */}
              <div
                data-no-drag
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-x-0 bottom-0 z-30 px-3.5 pt-10 pb-3 bg-gradient-to-t from-black/95 via-black/65 to-transparent flex flex-col gap-2"
              >
                <div
                  onClick={handleScrub}
                  className="w-full h-2 flex items-center cursor-pointer group/scrub"
                >
                  <div className="w-full h-1 group-hover/scrub:h-1.5 transition-all rounded-full bg-white/25 overflow-hidden">
                    <div
                      style={{ width: `${progressPct}%` }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      aria-label={isPlaying ? "Pause" : "Play"}
                      className="p-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause size={18} className="fill-white" />
                      ) : (
                        <Play size={18} className="fill-white" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleMute}
                      aria-label={isMuted ? "Unmute" : "Mute"}
                      className="p-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </button>

                    <span className="text-xs font-medium tabular-nums text-white/90">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={cycleSpeed}
                      aria-label="Playback speed"
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-semibold tabular-nums cursor-pointer"
                    >
                      {playbackRate}x
                    </button>

                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      aria-label="Toggle fullscreen"
                      className="p-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
                    >
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </m.div>

        {/* Project Details Section */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <GlassmorphismCard className="p-6 md:p-8">
            <div className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex gap-2 flex-wrap">
                  {project.category.map((cat) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className={`text-xs font-semibold px-3 py-1 rounded-full border-none ${
                        cat === "Featured"
                          ? "bg-amber-500/20 text-amber-300"
                          : cat === "Brand Promos"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>

                {project.duration && (
                  <div className="flex items-center text-gray-400 text-sm bg-white/5 px-3 py-1 rounded-full">
                    <Clock className="mr-1.5" size={14} />
                    {project.duration}
                  </div>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white leading-tight">
                {project.video_title}
              </h1>

              {project.video_description && (
                <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {project.video_description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">
                  Production Info
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="mr-2 text-gray-500" size={15} />
                    <span>
                      Date:{" "}
                      {new Date(project.publish_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {project.software_used && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">
                    Editing Software
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.software_used.map((software) => (
                      <Badge
                        key={software}
                        variant="outline"
                        className="border-white/15 bg-white/5 text-gray-300"
                      >
                        {software}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassmorphismCard>
        </m.div>
      </div>
    </div>
  );
}

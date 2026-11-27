"use client";

import { useEffect, useMemo, useState } from "react";

interface InstagramActionRailProps {
  projectId: string;
  /** Opens full title/description drawer inside card when Comment is tapped */
  onCommentClick?: () => void;
  /** Fades out the rail during active playback */
  hidden?: boolean;
}

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function formatLikes(likesK: number): string {
  if (likesK >= 1000) return "1M";
  return `${likesK}K`;
}

function formatComments(count: number): string {
  if (count >= 1000) return "1K";
  return String(count);
}

function formatShares(count: number): string {
  return count.toLocaleString("en-US");
}

/**
 * Clean white-outline Instagram Reels right-side action rail
 * (Like -> Comment -> Share) without entrance pop-up animations.
 */
export default function InstagramActionRail({
  projectId,
  onCommentClick,
  hidden = false,
}: InstagramActionRailProps) {
  const [liked, setLiked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Sync saved likes from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kishan_liked_ids");
      if (saved) {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids) && ids.includes(projectId)) {
          setLiked(true);
        }
      }
    } catch {}
  }, [projectId]);

  const metrics = useMemo(() => {
    const seed = hashId(projectId);
    const rawLikesK = 100 + (seed % 901);
    const rawComments = 500 + ((seed >>> 6) % 501);
    const rawShares = 800 + ((seed >>> 13) % 701);

    return {
      likesLabel: formatLikes(rawLikesK + (liked && rawLikesK < 1000 ? 1 : 0)),
      commentsLabel: formatComments(rawComments),
      sharesLabel: formatShares(rawShares),
    };
  }, [projectId, liked]);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLiked((prev) => {
      const next = !prev;
      try {
        const saved = localStorage.getItem("kishan_liked_ids");
        let ids: string[] = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(ids)) ids = [];
        ids = next
          ? Array.from(new Set([...ids, projectId]))
          : ids.filter((id) => id !== projectId);
        localStorage.setItem("kishan_liked_ids", JSON.stringify(ids));
      } catch {}
      return next;
    });
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onCommentClick) {
      onCommentClick();
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/project/${projectId}`
        : `/project/${projectId}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 1400);
  };

  return (
    <div
      className={`flex flex-col items-center gap-3.5 text-white select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)] transition-opacity duration-500 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* 1. Like (Heart) */}
      <button
        type="button"
        onClick={handleLikeToggle}
        aria-label={`Likes: ${metrics.likesLabel}`}
        className="flex flex-col items-center gap-1 group/rail cursor-pointer focus:outline-none active:scale-90 transition-transform"
      >
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 transition-colors duration-200 ${
            liked
              ? "fill-[#FF3040] stroke-[#FF3040]"
              : "fill-none stroke-white"
          }`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className="text-[11px] font-semibold leading-none tabular-nums tracking-tight">
          {metrics.likesLabel}
        </span>
      </button>

      {/* 2. Comment */}
      <button
        type="button"
        onClick={handleComment}
        aria-label={`Comments: ${metrics.commentsLabel}`}
        className="flex flex-col items-center gap-1 group/rail cursor-pointer focus:outline-none active:scale-90 transition-transform"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-none stroke-white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" />
        </svg>
        <span className="text-[11px] font-semibold leading-none tabular-nums tracking-tight">
          {metrics.commentsLabel}
        </span>
      </button>

      {/* 3. Share */}
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Shares: ${metrics.sharesLabel}`}
        className="relative flex flex-col items-center gap-1 group/rail cursor-pointer focus:outline-none active:scale-90 transition-transform"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-none stroke-white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <span className="text-[11px] font-semibold leading-none tabular-nums tracking-tight">
          {copiedShare ? "Copied" : metrics.sharesLabel}
        </span>
      </button>
    </div>
  );
}

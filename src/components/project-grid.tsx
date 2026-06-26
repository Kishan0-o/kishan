"use client";

import { useState, useEffect, useCallback } from "react";
import { m } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/project-card";
import type { VideoProject } from "@/types/videos";
import { getVideoProjectsByCategory } from "@/lib/helper";
import { useMobile } from "@/hooks/use-mobile";

interface ProjectGridProps {
  initialCategories: { category: string; count: number }[];
  initialProjects: VideoProject[];
}

export default function ProjectGrid({ initialCategories, initialProjects }: ProjectGridProps) {
  const isMobile = useMobile();
  const [selectedCategory, setSelectedCategory] = useState("Featured");
  const [displayedProjects, setDisplayedProjects] = useState<VideoProject[]>(initialProjects.slice(0, 9));
  const [allProjects, setAllProjects] = useState<VideoProject[]>(initialProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProjects.length > 9);

  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    let projects;
    if (selectedCategory === "All") {
        projects = initialProjects;
    } else {
        projects = getVideoProjectsByCategory(selectedCategory);
    }
    setAllProjects(projects);
    setDisplayedProjects(projects.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
    setHasMore(projects.length > ITEMS_PER_PAGE);
  }, [selectedCategory, initialProjects]);

  const loadMoreProjects = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newProjects = allProjects.slice(startIndex, endIndex);
    setDisplayedProjects((prev) => [...prev, ...newProjects]);
    setCurrentPage(nextPage);
    setHasMore(endIndex < allProjects.length);
    setLoading(false);
  }, [currentPage, allProjects, loading, hasMore]);

  useEffect(() => {
    if (selectedCategory === "All") return;
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreProjects();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedCategory, loadMoreProjects]);

  const explicitOrder = ["Featured", "Shorts", "Meta Ads", "All"];
  const orderedCategories = [...initialCategories].sort((a, b) => {
    const orderA = explicitOrder.indexOf(a.category);
    const orderB = explicitOrder.indexOf(b.category);
    return (orderA !== -1 ? orderA : 99) - (orderB !== -1 ? orderB : 99);
  });

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {orderedCategories.map(({ category, count }) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
              ${selectedCategory === category
                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
              }
            `}
          >
            {category}
            <span className={`
              ml-2 text-[10px] px-1.5 py-0.5 rounded-full transition-colors
              ${selectedCategory === category ? "bg-black text-white" : "bg-white/10 text-gray-400"}
            `}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {displayedProjects.map((project, index) => (
          isMobile ? (
            // No animation wrapper on mobile — saves a lot of JS work
            <div key={project.id}>
              <ProjectCard project={project} />
            </div>
          ) : (
            <m.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(index * 0.05, 0.3) }}
            >
              <ProjectCard project={project} />
            </m.div>
          )
        ))}
      </div>

      {/* Load More Button for "All" category */}
      {selectedCategory === "All" && hasMore && (
        <div className="text-center mt-20">
          <Button
            onClick={loadMoreProjects}
            disabled={loading}
            size="lg"
            className="bg-white text-black hover:bg-gray-200 rounded-full px-8 h-12 font-medium transition-all hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More Projects
                <ArrowRight className="ml-2" size={16} />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}

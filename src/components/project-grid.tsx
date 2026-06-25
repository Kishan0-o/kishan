"use client";

import { useState, useEffect, useCallback } from "react";
import { m } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/project-card";
import type { VideoProject } from "@/types/videos";
import { getVideoProjectsByCategory } from "@/lib/helper";

interface ProjectGridProps {
  initialCategories: { category: string; count: number }[];
  initialProjects: VideoProject[];
}

export default function ProjectGrid({ initialCategories, initialProjects }: ProjectGridProps) {
  // 1. Sets "Shorts" as the default open page instead of Featured or All
  const [selectedCategory, setSelectedCategory] = useState("Shorts");
  const [displayedProjects, setDisplayedProjects] = useState<VideoProject[]>(initialProjects.slice(0, 9));
  const [allProjects, setAllProjects] = useState<VideoProject[]>(initialProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProjects.length > 9);

  const ITEMS_PER_PAGE = 9;

  // Load projects for selected category
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

  // Load more projects
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

  // Infinite scroll for non-"All" categories
  useEffect(() => {
    if (selectedCategory === "All") return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMoreProjects();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedCategory, loadMoreProjects]);

  // 2. Removed "Featured" completely from your array priority layout
  const explicitOrder = ["Shorts", "Meta Ads", "All"];

  // Sorts and filters the categories array to strictly match your explicitOrder
  const orderedCategories = [...initialCategories]
    .filter(item => explicitOrder.includes(item.category)) // Ensures 'Featured' is physically excluded
    .sort((a, b) => {
      const orderA = explicitOrder.indexOf(a.category);
      const orderB = explicitOrder.indexOf(b.category);
      return (orderA !== -1 ? orderA : 99) - (orderB !== -1 ? orderB : 99);
    });

  return (
    <>
        {/* Category Filter */}
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
        >
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
        </m.div>

        {/* Projects Grid */}
        <m.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
            {displayedProjects.map((project, index) => (
            <m.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
            >
                <ProjectCard project={project} />
            </m.div>
            ))}
        </m.div>

        {/* Load More Button for "All" category */}
        {selectedCategory === "All" && hasMore && (
            <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-20"
            >
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
            </m.div>
        )}
    </>
  );
}

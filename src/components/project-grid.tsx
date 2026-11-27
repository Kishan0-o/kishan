"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { m } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/project-card";
import type { VideoProject } from "@/types/videos";

interface ProjectGridProps {
  initialCategories: { category: string; count: number }[];
  initialProjects: VideoProject[];
}

export default function ProjectGrid({
  initialCategories,
  initialProjects,
}: ProjectGridProps) {
  // 1. Default starting tab is "Featured" when populated, otherwise "UGC & DTC Ads"
  const defaultCategory =
    (initialCategories.find((c) => c.category === "Featured")?.count ?? 0) > 0
      ? "Featured"
      : "UGC & DTC Ads";
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filter projects based on selected category
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => p.category.includes(selectedCategory));
  }, [initialProjects, selectedCategory]);

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage, ITEMS_PER_PAGE]);

  const hasMore = displayedProjects.length < filteredProjects.length;

  const loadMoreProjects = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setCurrentPage((prev) => prev + 1);
    setLoading(false);
  }, [loading, hasMore]);

  // Reset pagination on category change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Category sort priority
  const explicitOrder = [
    "Featured",
    "UGC & DTC Ads",
    "Social Media",
    "A/B Testing",
    "Product Showcase",
    "Brand Promos",
  ];

  const orderedCategories = useMemo(() => {
    return [...initialCategories].sort((a, b) => {
      const orderA = explicitOrder.indexOf(a.category);
      const orderB = explicitOrder.indexOf(b.category);
      return (orderA !== -1 ? orderA : 99) - (orderB !== -1 ? orderB : 99);
    });
  }, [initialCategories]);

  return (
    <>
      {/* Category Tabs */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center items-center gap-3 mb-12"
      >
        {orderedCategories.map(({ category }) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
              ${
                selectedCategory === category
                  ? "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.35)] scale-105"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
              }
            `}
          >
            {category}
          </button>
        ))}
      </m.div>

      {/* Projects Grid */}
      {displayedProjects.length > 0 ? (
        <m.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
        >
          {displayedProjects.map((project, index) => (
            <m.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: Math.min(index * 0.04, 0.4),
              }}
            >
              <ProjectCard
                project={project}
                activeCategory={selectedCategory}
              />
            </m.div>
          ))}
        </m.div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">No videos match this category filter.</p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-16"
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
                Load More
                <ArrowRight className="ml-2" size={16} />
              </>
            )}
          </Button>
        </m.div>
      )}
    </>
  );
}

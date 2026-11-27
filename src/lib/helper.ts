import { clientsData } from "@/db/clients";
import { allVideoProjects } from "@/db/projects";
import { Client, VideoProject } from "@/types/videos";
import { getExtraProjects, getHiddenProjectIds } from "@/lib/kv";

// Pulls the YouTube video ID out of a full URL (watch/embed/shorts/youtu.be)
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

// Returns merged video projects sorted newest-first
export const getMergedProjects = async (): Promise<VideoProject[]> => {
  try {
    const [extraProjects, hiddenIds] = await Promise.all([
      getExtraProjects().catch(() => []),
      getHiddenProjectIds().catch(() => []),
    ]);
    const hiddenSet = new Set(hiddenIds);

    const merged = [...extraProjects, ...allVideoProjects]
      .filter((p) => !hiddenSet.has(p.id));

    // Deduplicate by ID
    const seen = new Set<string>();
    const unique: VideoProject[] = [];
    for (const p of merged) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        unique.push(p);
      }
    }

    return unique.sort(
      (a, b) =>
        new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
    );
  } catch {
    return [...allVideoProjects].sort(
      (a, b) =>
        new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
    );
  }
};

export const getCategoriesWithCountFromProjects = (
  projects: VideoProject[]
): { category: string; count: number }[] => {
  const categoryCountMap = new Map<string, number>();
  projects.forEach((project) => {
    project.category.forEach((cat) => {
      categoryCountMap.set(cat, (categoryCountMap.get(cat) || 0) + 1);
    });
  });

  const orderedCategories = [
    "Featured",
    "UGC & DTC Ads",
    "Social Media",
    "A/B Testing",
    "Product Showcase",
    "Brand Promos",
  ];
  const list = orderedCategories.map((category) => ({
    category,
    count: categoryCountMap.get(category) || 0,
  }));

  return list;
};

// Helper function to get all projects sorted by date (latest first)
export const getAllVideoProjects = (): VideoProject[] => {
  return [...allVideoProjects].sort(
    (a, b) =>
      new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
  );
};

export const getAllVideoProjectsFlattened = (): VideoProject[] => {
  return getAllVideoProjects();
};

// Helper function to get projects by category sorted by date (latest first)
export const getVideoProjectsByCategory = (
  category: string
): VideoProject[] => {
  if (category === "All") {
    return getAllVideoProjects();
  }

  const filteredProjects = allVideoProjects.filter((project) =>
    project.category.includes(category)
  );

  return filteredProjects.sort(
    (a, b) =>
      new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
  );
};

// Helper function to get project by ID
export const getVideoProjectById = (id: string): VideoProject | undefined => {
  return allVideoProjects.find((project) => project.id === id);
};

// Helper function to get all unique categories
export const getVideoCategories = (): string[] => {
  return [
    "Featured",
    "UGC & DTC Ads",
    "Social Media",
    "A/B Testing",
    "Product Showcase",
    "Brand Promos",
  ];
};

// Returns categories with project count
export const getVideoCategoriesWithCount = (): {
  category: string;
  count: number;
}[] => {
  return getCategoriesWithCountFromProjects(allVideoProjects);
};

export const getVideoCategoriesWithCountIncludingAll = (): {
  category: string;
  count: number;
}[] => {
  return getCategoriesWithCountFromProjects(allVideoProjects);
};

export function getFeaturedProjects(limit = 6): VideoProject[] {
  return allVideoProjects.filter(p => p.category.includes("Featured")).slice(0, limit);
}

export function getClients(): Client[] {
  return clientsData;
}

// Helper function to get the proper embed link
export const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  // Direct MP4 or local path
  if (url.startsWith("/") || url.endsWith(".mp4")) {
    return url;
  }

  // Handle Shorts
  if (url.includes("youtube.com/shorts/")) {
    const match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  // Handle Regular YouTube video
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

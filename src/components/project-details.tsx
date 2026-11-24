"use client";

import { useState } from "react";
import { m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import GlassmorphismCard from "@/components/glassmorphism-card";
import {
    ArrowLeft,
    Play,
    Clock,
    User,
    Calendar,
    Quote,
    ExternalLink,
} from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/helper";
import type { VideoProject } from "@/types/videos";

interface ProjectDetailsProps {
    project: VideoProject;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
    const [showVideo, setShowVideo] = useState(false);
    const embedUrl = getYouTubeEmbedUrl(project.video_link);

    const isVertical =
        project.video_link?.includes("/shorts/") ||
        project.category?.includes("Shorts") ||
        project.category?.includes("Meta Ads") ||
        project.category?.includes("Featured") ||
        (!project.category?.includes("Landscape") &&
            !project.category?.includes("Documentary"));

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <m.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Button
                        asChild
                        variant="outline"
                        className="pl-4 pr-6 py-2 h-auto text-sm font-medium text-white bg-white/5 border border-white/10 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl group"
                    >
                        <Link href="/">
                            <ArrowLeft className="mr-2" size={16} />
                            Back to Projects
                        </Link>
                    </Button>
                </m.div>

                {/* Video Player Section */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <GlassmorphismCard className="p-4 md:p-6">
                        <div
                            className={`relative rounded-lg overflow-hidden bg-gray-900 ${
                                isVertical
                                    ? "aspect-[9/16] max-w-sm mx-auto shadow-2xl"
                                    : "aspect-video"
                            }`}
                        >
                            {showVideo && embedUrl ? (
                                <iframe
                                    src={`${embedUrl}?autoplay=1&modestbranding=1&rel=0`}
                                    title={project.video_title}
                                    className="w-full h-full"
                                    allowFullScreen
                                    allow="autoplay; encrypted-media"
                                />
                            ) : (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={
                                            project.cover_image
                                                ? `https://img.youtube.com/vi/${project.cover_image}/maxresdefault.jpg`
                                                : "/placeholder.svg"
                                        }
                                        alt={project.video_title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Button
                                            onClick={() => setShowVideo(true)}
                                            size="lg"
                                            className="bg-red-600 hover:bg-red-700 cursor-pointer"
                                        >
                                            <Play className="mr-2" size={24} />
                                            Play Video
                                        </Button>
                                    </div>
                                </div>
                            )}
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
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-end mb-4 gap-4">
                                {project.duration && (
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <Clock className="mr-1" size={14} />
                                        {project.duration}
                                    </div>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
                                {project.video_title}
                            </h1>
                            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                                {project.video_description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-white">
                                    Project Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center text-gray-400">
                                        <Calendar className="mr-2" size={14} />
                                        <span>
                                            Published:{" "}
                                            {new Date(project.publish_date).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <User className="mr-2" size={14} />
                                        <span>Client: {project.client_name}</span>
                                    </div>
                                </div>
                            </div>

                            {project.software_used && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-white">
                                        Software Used
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.software_used.map((software) => (
                                            <Badge
                                                key={software}
                                                variant="outline"
                                                className="border-gray-600 text-gray-300"
                                            >
                                                {software}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 text-white">
                                Categories
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.category.map((category) => (
                                    <Badge
                                        key={category}
                                        className="bg-white/10 hover:bg-white/20 text-white"
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {project.tags && project.tags.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-3 text-white">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="bg-gray-800 text-gray-300"
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {project.client_feedback && (
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold mb-3 text-white">
                                    Client Feedback
                                </h3>
                                <div className="relative pl-6 italic text-gray-300">
                                    <Quote
                                        className="absolute left-0 top-0 text-blue-500"
                                        size={18}
                                    />
                                    {project.client_feedback}
                                </div>
                            </div>
                        )}
                    </GlassmorphismCard>
                </m.div>

                {/* Project Images Carousel */}
                {project.project_images && project.project_images.length > 0 && (
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            Project Screenshots
                        </h2>
                        <GlassmorphismCard className="p-4 md:p-6">
                            <Carousel className="w-full max-w-4xl mx-auto">
                                <CarouselContent>
                                    {project.project_images.map((image, index) => (
                                        <CarouselItem key={index} className="basis-1/2">
                                            <div className="p-1">
                                                <div className="relative aspect-video rounded-lg overflow-hidden">
                                                    <Image
                                                        src={image || "/placeholder.svg"}
                                                        alt={`Project image ${index + 1}`}
                                                        fill
                                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-2 bg-black/50 hover:bg-black/80 text-white border-0" />
                                <CarouselNext className="right-2 bg-black/50 hover:bg-black/80 text-white border-0" />
                            </Carousel>
                        </GlassmorphismCard>
                    </m.div>
                )}

                {/* External Link */}
                {project.video_link && (
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-center"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-black hover:bg-gray-200 rounded-full px-8 h-12 font-medium transition-all hover:scale-105"
                        >
                            <a
                                href={project.video_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="mr-2" size={16} />
                                View on YouTube
                            </a>
                        </Button>
                    </m.div>
                )}
            </div>
        </div>
    );
}

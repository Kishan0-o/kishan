import { Metadata } from "next";
import { notFound } from "next/navigation";
import { allVideoProjects } from "@/db/projects";
import { getExtraProjects, getHiddenProjectIds } from "@/lib/kv";
import ProjectDetails from "@/components/project-details";

async function findProject(id: string) {
  try {
    const hiddenIds: string[] = await getHiddenProjectIds().catch(() => []);
    if (hiddenIds.includes(id)) return undefined;
  } catch {}

  const builtIn = allVideoProjects.find((p) => p.id === id);
  if (builtIn) return builtIn;

  try {
    const extras = await getExtraProjects().catch(() => []);
    return extras.find((p) => p.id === id);
  } catch {
    return undefined;
  }
}

// Generate unique static params for all projects
export async function generateStaticParams() {
  return allVideoProjects.map((project) => ({
    id: project.id,
  }));
}

// Generate metadata for each project
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await findProject(id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const imageUrl = project.cover_image.startsWith("/")
    ? project.cover_image
    : `https://img.youtube.com/vi/${project.cover_image}/maxresdefault.jpg`;

  return {
    title: `${project.video_title} | Kishan Portfolio`,
    description: project.video_description,
    openGraph: {
      title: project.video_title,
      description: project.video_description,
      images: [
        {
          url: imageUrl,
          width: 1280,
          height: 720,
          alt: project.video_title,
        },
      ],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await findProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetails project={project} />;
}

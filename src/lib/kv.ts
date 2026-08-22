import { Redis } from "@upstash/redis";
import type { VideoProject } from "@/types/videos";

const KV_KEY = "extra_projects";

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  return new Redis({ url, token });
}

export async function getExtraProjects(): Promise<VideoProject[]> {
  const redis = getRedis();
  if (!redis) return [];

  const data = await redis.get<VideoProject[]>(KV_KEY);
  return data ?? [];
}

export async function addExtraProject(
  project: VideoProject
): Promise<VideoProject[]> {
  const redis = getRedis();
  if (!redis) {
    throw new Error(
      "Database not connected. Add KV_REST_API_URL and KV_REST_API_TOKEN in Vercel."
    );
  }

  const existing = await getExtraProjects();
  const withoutDuplicate = existing.filter((p) => p.id !== project.id);
  const updated = [project, ...withoutDuplicate];

  await redis.set(KV_KEY, updated);
  return updated;
}

export async function deleteExtraProject(id: string): Promise<VideoProject[]> {
  const redis = getRedis();
  if (!redis) return [];

  const existing = await getExtraProjects();
  const updated = existing.filter((p) => p.id !== id);
  await redis.set(KV_KEY, updated);
  return updated;
}

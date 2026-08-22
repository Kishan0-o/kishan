import { Redis } from "@upstash/redis";
import type { VideoProject } from "@/types/videos";

const KV_KEY = "extra_projects";
const HIDDEN_KEY = "hidden_project_ids";

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

// IDs of built-in (hardcoded) projects that have been "deleted" from the
// site. We can't remove them from the code file itself without a new
// deploy, so instead we keep a hidden-list and filter them out when
// merging projects together.
export async function getHiddenProjectIds(): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];

  const data = await redis.get<string[]>(HIDDEN_KEY);
  return data ?? [];
}

export async function hideProjectId(id: string): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error(
      "Database not connected. Add KV_REST_API_URL and KV_REST_API_TOKEN in Vercel."
    );
  }

  const existing = await getHiddenProjectIds();
  if (!existing.includes(id)) {
    await redis.set(HIDDEN_KEY, [...existing, id]);
  }
}

// Deletes a project no matter where it lives: if it was added via the "+"
// button, it's removed outright; if it's one of the original built-in
// projects, it's added to the hidden list instead.
export async function deleteProjectEverywhere(id: string): Promise<void> {
  const extras = await getExtraProjects();
  const isExtra = extras.some((p) => p.id === id);

  if (isExtra) {
    await deleteExtraProject(id);
  } else {
    await hideProjectId(id);
  }
}

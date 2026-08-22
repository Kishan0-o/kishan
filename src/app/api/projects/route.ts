import { NextRequest, NextResponse } from "next/server";
import { addExtraProject, getExtraProjects, deleteProjectEverywhere } from "@/lib/kv";
import { extractYouTubeId } from "@/lib/helper";
import type { VideoProject } from "@/types/videos";

export async function GET() {
  try {
    const projects = await getExtraProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Failed to fetch extra projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      password,
      video_title,
      video_link,
      video_description,
      client_name,
      client_image,
      category,
      duration,
      software_used,
      tags,
    } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not set on the server." },
        { status: 500 }
      );
    }
    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    if (!video_title || !video_link) {
      return NextResponse.json(
        { error: "Video title and video link are required." },
        { status: 400 }
      );
    }

    const videoId = extractYouTubeId(video_link);
    if (!videoId) {
      return NextResponse.json(
        { error: "Couldn't find a valid YouTube video ID in that link." },
        { status: 400 }
      );
    }

    const newProject: VideoProject = {
      id: videoId,
      video_title,
      video_description: video_description || "",
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string" && tags.trim()
        ? tags.split(",").map((t: string) => t.trim())
        : [],
      cover_image: videoId,
      publish_date: new Date().toISOString().split("T")[0],
      client_name: client_name || "Personal Project",
      // Default to the RaazMD logo when no client image is supplied, since
      // every project on this site is for the same client. Previously this
      // fell back to a generic placeholder icon, which is why new projects
      // showed a blank/gradient icon instead of the RaazMD logo.
      client_image: client_image || "/companies/RaazMD.png",
      client_feedback: "",
      video_link,
      project_images: [],
      category: Array.isArray(category)
        ? category
        : typeof category === "string" && category.trim()
        ? category.split(",").map((c: string) => c.trim())
        : ["Featured"],
      duration: duration || undefined,
      software_used: Array.isArray(software_used)
        ? software_used
        : typeof software_used === "string" && software_used.trim()
        ? software_used.split(",").map((s: string) => s.trim())
        : undefined,
    };

    const updated = await addExtraProject(newProject);

    return NextResponse.json({ success: true, project: newProject, total: updated.length });
  } catch (error) {
    console.error("Failed to add project:", error);
    return NextResponse.json(
      { error: "Something went wrong while adding the project." },
      { status: 500 }
    );
  }
}

// DELETE: remove a project (works for both "+"-button-added projects and
// original built-in ones). Requires the correct admin password.
export async function DELETE(req: NextRequest) {
  try {
    const { password, id } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not set on the server." },
        { status: 500 }
      );
    }
    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing project id." }, { status: 400 });
    }

    await deleteProjectEverywhere(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting the project." },
      { status: 500 }
    );
  }
}

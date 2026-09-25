import { NextResponse } from "next/server";
import { profile } from "@/content/profile";
import type { RepoDTO } from "@/lib/github";

/**
 * Secure, server-only GitHub proxy.
 *
 * - Runs only on the server; GITHUB_TOKEN (if set) is NEVER sent to the client.
 * - Fetches REAL public repositories for the verified username only.
 * - Fabricates nothing: on any failure it returns an empty list + a flag,
 *   and the UI degrades gracefully to a "view on GitHub" link.
 */

export const revalidate = 3600; // cache upstream for an hour

type GhRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  updated_at: string;
  topics?: string[];
};

export async function GET() {
  const user = profile.github;
  const token = process.env.GITHUB_TOKEN; // server-only

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(
        user
      )}/repos?per_page=100&sort=updated`,
      { headers, next: { revalidate } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, repos: [] as RepoDTO[], profileUrl: profile.githubUrl },
        { status: 200 }
      );
    }

    const raw = (await res.json()) as GhRepo[];

    const repos: RepoDTO[] = raw
      .filter((r) => !r.fork && !r.archived)
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, 6)
      .map((r) => ({
        id: r.id,
        name: r.name,
        url: r.html_url,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        updatedAt: r.updated_at,
        topics: r.topics ?? [],
      }));

    return NextResponse.json(
      { ok: true, repos, profileUrl: profile.githubUrl },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, repos: [] as RepoDTO[], profileUrl: profile.githubUrl },
      { status: 200 }
    );
  }
}

/** Shared DTO for the GitHub proxy — imported by both the route and the UI. */
export type RepoDTO = {
  id: number;
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
};

export type GitHubResponse = {
  ok: boolean;
  repos: RepoDTO[];
  profileUrl: string;
};

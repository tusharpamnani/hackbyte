// Types for our data structures
interface CommitResponse {
  commit: {
    author: {
      date: string;
    };
    message: string;
  };
  sha: string;
  files?: FileData[];
}

interface FileData {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

interface Change {
  removed: string;
  added: string;
}

class FileChange {
  constructor(
    public filename: string,
    public status: string,
    public additions: number,
    public deletions: number,
    public changes: Change[]
  ) {}
}

interface CommitData {
  date: string;
  message: string;
  data: string;
}

export async function GithubTokenExtract(UserId: string) {
  const response = await fetch(
    `https://api.clerk.dev/v1/users/${UserId}/oauth_access_tokens/oauth_github`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLERK_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch github token from Clerk");
  }

  const data = await response.json();
  console.log("data[0].token", data[0].token);
  return data[0].token;
}

// API service for GitHub interactions
class GitHubService {
  private headers: Record<string, string>;

  constructor(token: string) {
    this.headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    };
  }

  /**
   * Extract meaningful changes from the patch text
   */
  private extractMeaningfulChanges(patch: string | undefined): Change[] {
    if (!patch) {
      return [];
    }

    const changes: Change[] = [];
    let currentChange: { old: string[]; new: string[] } = { old: [], new: [] };

    const lines = patch.split("\n");

    for (const line of lines) {
      // Skip chunk headers
      if (line.startsWith("@@")) {
        if (currentChange.old.length || currentChange.new.length) {
          changes.push({
            removed: currentChange.old.join("\n"),
            added: currentChange.new.join("\n"),
          });
          currentChange = { old: [], new: [] };
        }
        continue;
      }

      // Collect removed and added lines
      if (line.startsWith("-") && !line.startsWith("---")) {
        currentChange.old.push(line.substring(1).trim());
      } else if (line.startsWith("+") && !line.startsWith("+++")) {
        currentChange.new.push(line.substring(1).trim());
      }
    }

    // Add the last change if exists
    if (currentChange.old.length || currentChange.new.length) {
      changes.push({
        removed: currentChange.old.join("\n"),
        added: currentChange.new.join("\n"),
      });
    }

    return changes.filter((change) => change.removed || change.added);
  }

  /**
   * Fetch and parse commit diff information
   */
  async fetchCommitDiff(
    owner: string,
    repo: string,
    commitSha: string
  ): Promise<FileChange[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`;

    try {
      const response = await fetch(url, { headers: this.headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch commit diff: ${response.status}`);
      }

      const commitData = (await response.json()) as CommitResponse;
      const fileChanges: FileChange[] = [];

      for (const file of commitData.files || []) {
        const changes = this.extractMeaningfulChanges(file.patch);

        const fileChange = new FileChange(
          file.filename,
          file.status,
          file.additions,
          file.deletions,
          changes
        );

        fileChanges.push(fileChange);
      }

      return fileChanges;
    } catch (error) {
      console.error("Error fetching commit diff:", error);
      throw error;
    }
  }

  /**
   * Format the diff summary in a readable way
   */
  formatDiffSummary(fileChanges: FileChange[]): string {
    const summary: string[] = [];

    for (const file of fileChanges) {
      // Only include files with actual changes
      if (file.changes.length === 0) {
        continue;
      }

      summary.push(`\nFile: ${file.filename}`);
      summary.push(`Status: ${file.status}`);
      summary.push(`Changes: +${file.additions} -${file.deletions}`);

      file.changes.forEach((change, idx) => {
        if (change.removed && change.added) {
          summary.push(`\nChange ${idx + 1}:`);
          summary.push("Removed:");
          summary.push(change.removed);
          summary.push("Added:");
          summary.push(change.added);
        } else if (change.removed) {
          summary.push(`\nRemoved:`);
          summary.push(change.removed);
        } else if (change.added) {
          summary.push(`\nAdded:`);
          summary.push(change.added);
        }
      });
    }

    return summary.join("\n");
  }

  /**
   * Get a formatted summary of commit changes
   */
  async getCommitChanges(
    owner: string,
    repo: string,
    commitSha: string
  ): Promise<string> {
    try {
      const fileChanges = await this.fetchCommitDiff(owner, repo, commitSha);
      return this.formatDiffSummary(fileChanges);
    } catch (error) {
      return `Error fetching commit changes: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  /**
   * Fetch commits from a repository
   */
  async fetchCommits(owner: string, repo: string): Promise<CommitData[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits`;

    try {
      const response = await fetch(url, { headers: this.headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch commits: ${response.status}`);
      }

      const commits = (await response.json()) as CommitResponse[];
      const store: CommitData[] = [];

      for (const commit of commits) {
        const data: CommitData = {
          date: commit.commit.author.date,
          message: commit.commit.message,
          data: await this.getCommitChanges(owner, repo, commit.sha),
        };
        store.push(data);
      }

      return store;
    } catch (error) {
      console.error("Error fetching commits:", error);
      throw error;
    }
  }
}

// Example usage with async/await
export async function GithubDataCollect(
  userId: string,
  owner: string,
  repo: string
) {
  const token = await GithubTokenExtract(userId);

  const githubService = new GitHubService(token);

  try {
    const commits = await githubService.fetchCommits(owner, repo);
    return commits;
  } catch (error) {
    console.error("Error in main:", error);
    return;
  }
}

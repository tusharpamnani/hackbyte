import { NextRequest, NextResponse } from "next/server";
import { createRepo } from "../../../../../utils/github/GithubRepo";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, repoName, desc } = body;

  if (!userId || !repoName || !desc) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const RepoName = await createRepo(userId, repoName, desc);
    // console.log("repoName hai ye bhai", RepoName);
    return NextResponse.json({ success: true, RepoName });
  } catch (error) {
    console.error("Error creating repo:", error);
    return NextResponse.json(
      { error: "Failed to create repo" },
      { status: 500 }
    );
  }
}

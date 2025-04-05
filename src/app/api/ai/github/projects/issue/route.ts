/* eslint-disable  @typescript-eslint/no-explicit-any */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { UpdateIssues } from "../../../../../../utils/github/GithubProjectBackchodi";
import getPrismaClient from "../../../../../../lib/prisma";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, owner, issues, batchId } = body;

    // Input validation
    if (!userId || !owner || !batchId || !Array.isArray(issues) || issues.length === 0) {
      return NextResponse.json(
        {
          error: "Missing or invalid fields: userId, owner, batchId, and issues (non-empty array) are required.",
        },
        { status: 400 }
      );
    }

    // Find GitHub project ID from batch
    const batch = await prisma.batch.findFirst({
      where: { id: batchId },
      select: { githubProjectId: true },
    });

    if (!batch || !batch.githubProjectId) {
      return NextResponse.json({ error: "GitHub project not found for the given batchId." }, { status: 404 });
    }

    // Perform the update using UpdateIssues()
    const updateResult = await UpdateIssues(
      batch.githubProjectId,
      issues, // [{ issueId, status }]
      userId,
      owner
    );

    if (!updateResult) {
      return NextResponse.json({ error: "Failed to update GitHub issues." }, { status: 500 });
    }

    return NextResponse.json({ message: "Issues updated successfully." }, { status: 200 });

  } catch (error: any) {
    console.error("Error updating GitHub issues:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error?.message || error },
      { status: 500 }
    );
  }
}

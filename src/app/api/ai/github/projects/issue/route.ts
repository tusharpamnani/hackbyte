import { NextRequest, NextResponse } from "next/server";
import { UpdateIssues } from "../../../../../../utils/github/GithubProjectBackchodi";
import getPrismaClient from "../../../../../../lib/prisma";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, owner, issues, batchId } = body;

        // Validation
        if (!owner || !userId || !issues || !batchId || !Array.isArray(issues)) {
            return NextResponse.json(
                { error: "owner, userId, issues (array), and batchId are required" },
                { status: 400 }
            );
        }

        // Find project ID from batch
        const batch = await prisma.batch.findFirst({
            where: { id: batchId },
            select: { githubProjectId: true },
        });

        if (!batch || !batch.githubProjectId) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Call UpdateIssues for the entire issues array
        const updateResult = await UpdateIssues(
            batch.githubProjectId, // GitHub Project ID
            issues, // Array of issues [{ issueId, status }]
            userId,
            owner
        );

        if (!updateResult) {
            return NextResponse.json({ error: "Issue updates failed" }, { status: 500 });
        }

        return NextResponse.json({ message: "Issues updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating issues:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { CreateProject, createProjectWithIssue, ProjectWithIssueResult } from "../../../../../utils/github/GithubProjectBackchodi";
import getPrismaClient from "../../../../../lib/prisma";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();
        // console.log('Received Request Body:', JSON.stringify(body, null, 2));

        const {
            owner,
            userId,
            batchId,
            repoName,
            BatchProjectId,
            ownerType,
            projectTitle,
            issueLabel,
            issueTitle,
            issueBody
        } = body;

        console.log("repo", repoName);
        // Validation
        if (!owner || !userId || !repoName || !ownerType || !projectTitle || !batchId || !BatchProjectId || !issueLabel || !issueBody || !issueTitle) {
            console.error('Validation Failed: Missing required parameters or invalid steps');
            return NextResponse.json(
                { error: "Missing required parameters or invalid steps" },
                { status: 400 }
            );
        }

        // Find existing project ID
        const projectRecord = await prisma.batch.findFirst({
            where: { id: batchId },
            select: { githubProjectId: true },
        });

        let projectId = projectRecord?.githubProjectId || null;
        let createdProjectId = null;

        if (!projectId){
            createdProjectId = await CreateProject(owner, userId, ownerType, projectTitle);
            projectId = createdProjectId;
            const batch = await prisma.batch.update({
                where: { id: batchId },
                data: { githubProjectId: projectId }
            });
            if(!batch){
                return NextResponse.json({ error: "Project creation failed" }, { status: 500 });
            }
    }


        const batchGithubProjectId = projectId;

        // Create project with issues for all steps
        const project: ProjectWithIssueResult = await createProjectWithIssue({
            owner,
            userId,
            repoName,
            ownerType,
            projectId : batchGithubProjectId,
            issueTitle,
            issueBody,
            issueLabel,
        });

        if (!project || !project.success) {
            return NextResponse.json({ error: "Issue creation failed" }, { status: 500 });
        }
        
        // // Update batch with GitHub project ID if not already stored
        // if (!projectRecord?.githubProjectId) {
            
        // }

        console.log({projectId : project.projectId, issueId : project.issueId, itemId : project.itemId})

        return NextResponse.json({ success: true, projectId : project.projectId, issueId : project.issueId, itemId : project.itemId}, { status: 200 });
    } catch (error) {
        console.error('Comprehensive Server Error:', error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}

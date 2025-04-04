import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import getPrismaClient from "../../../../lib/prisma";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not Signed In" }, { status: 401 });
    }

    const body = await req.json();
    const {
      batchId,
      title,
      description,
      level,
      status,
      learningObjectives,
      steps,
    } = body;

    if (
      !batchId ||
      !title ||
      !description ||
      !level ||
      !status ||
      !learningObjectives
    ) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        level,
        status,
        batchId,
        learningObjectives,
        steps: steps || null,
      },
    });

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Error adding project:", error);
    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not Signed In" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        month: {
          course: {
            user: {
              clerkId: user.id,
            },
          },
        },
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Error occurred while fetching projects" },
      { status: 500 }
    );
  }
}

// :TODO update kaise hoga ye dheakna hai; 
export async function PATCH(req : NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not Signed In" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, updatedFields } = body;

    if (!projectId || !updatedFields) {
      return NextResponse.json(
        { error: "Project ID and updated fields are required" },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...updatedFields,
      },
    });

    return NextResponse.json({ project: updatedProject }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Error occurred while updating project" },
      { status: 500 }
    );
  }
}

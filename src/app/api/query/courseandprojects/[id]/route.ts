import { NextRequest, NextResponse } from "next/server";
import getPrismaClient from "../../../../../lib/prisma";

const prisma = getPrismaClient();

export async function GET(
  request: NextRequest,
  { params }
) {
  const {id} = await params

  try {
    // 🔍 Step 1: Fetch Course
    const course = await prisma.course.findFirst({
      where: {
        id : Array.isArray(id) ? id[0] : id,
      },
      include: {
        batch: {
          include: {
            projects: true, // Fetch projects under each batch
          },
        },
      },
    });

    // ❌ If course doesn't exist
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // ✅ Step 2: Return course with batches and projects
    return NextResponse.json(
      {
        message: "Course fetched successfully",
        data: {
          id: course.id,
          title: course.title,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
          batches: course.batch.map((batch) => ({
            id: batch.id,
            number: batch.number,
            projects: batch.projects.map((project) => ({
              id: project.id,
              title: project.title,
              position : project.position,
              description: project.description,
              level: project.level,
              status: project.status,
              learningObjectives: project.learningObjectives,
              steps: project.steps,
              GithubData: project.GithubData || null,
            })),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

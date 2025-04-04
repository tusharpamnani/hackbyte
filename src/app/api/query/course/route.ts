import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import getPrismaClient from "../../../../lib/prisma";

const prisma = getPrismaClient();

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Not signed in" }, { status: 401 });
    }

    const clerkUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      include: {
        courses: true,
      },
    });

    if (!clerkUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Courses fetched successfully",
        data: clerkUser.courses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req : NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Not Signed In" }, { status: 401 });

    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Course title is required" }, { status: 400 });
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        user: {
          connect: {
            clerkId: user.id,
          },
        },
      },
    });

    return NextResponse.json({ course: newCourse }, { status: 201 });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json({ error: "Error occurred" }, { status: 500 });
  }
}

export async function PUT(req : NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Not Signed In" }, { status: 401 });

    const { courseId, newTitle } = await req.json();

    if (!courseId || !newTitle) {
      return NextResponse.json(
        { error: "Course ID and new title are required" },
        { status: 400 }
      );
    }

    // Update the course
    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        title: newTitle,
      },
    });

    return NextResponse.json({ updatedCourse }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Error occurred" }, { status: 500 });
  }
}

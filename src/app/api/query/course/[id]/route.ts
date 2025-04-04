import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import getPrismaClient from "../../../../../lib/prisma";

const prisma = getPrismaClient();

export async function GET(req: NextRequest, { params }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Not signed in" }, { status: 401 });
    }

    const { id } = params;

    const course = await prisma.course.findFirst({
      where: {
        user: {
          clerkId: user.id,
        },
        id: id, // Ensure id is properly formatted
      },
    });

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Course fetched successfully",
        data: course,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

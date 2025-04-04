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
    const { courseId, number } = body;

    if (!courseId || !number) {
      return NextResponse.json(
        { error: "Course ID and batch number are required" },
        { status: 400 }
      );
    }

    const newBatch = await prisma.batch.create({
      data: {
        number,
        courseId,
      },
    });

    return NextResponse.json({ batch: newBatch }, { status: 201 });
  } catch (error) {
    console.error("Error adding batch:", error);
    return NextResponse.json({ error: "Failed to add batch" }, { status: 500 });
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

    const batches = await prisma.batch.findMany({
      where: {
        course: {
          user: {
            clerkId: user.id,
          },
        },
      },
      include: {
        projects: true,
      },
    });

    return NextResponse.json({ batches }, { status: 200 });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Error occurred while fetching batches" },
      { status: 500 }
    );
  }
}

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
    const { batchId, newNumber } = body;

    if (!batchId || newNumber === undefined) {
      return NextResponse.json(
        { error: "Batch ID and new number are required" },
        { status: 400 }
      );
    }

    const updatedBatch = await prisma.batch.update({
      where: {
        id: batchId,
      },
      data: {
        number: newNumber,
      },
    });

    return NextResponse.json({ batch: updatedBatch }, { status: 200 });
  } catch (error) {
    console.error("Error updating batch:", error);
    return NextResponse.json(
      { error: "Error occurred while updating batch" },
      { status: 500 }
    );
  }
}

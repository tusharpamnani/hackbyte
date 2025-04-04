import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import getPrismaClient from "../../../../../lib/prisma";

const prisma = getPrismaClient();

export async function GET(req : NextRequest, { params }) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const user = await currentUser();
      if (!user) {
        return NextResponse.json({ error: "Not Signed In" }, { status: 401 });
      }
  
      const { number } = params;
  
      const batch = await prisma.batch.findFirst({
        where: {
          number: parseInt(number),
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
  
      if (!batch) {
        return NextResponse.json({ error: "Batch not found" }, { status: 404 });
      }
  
      return NextResponse.json({ batch }, { status: 200 });
    } catch (error) {
      console.error("Error fetching batch:", error);
      return NextResponse.json({ error: "Error occurred while fetching batch" }, { status: 500 });
    }
  }
  
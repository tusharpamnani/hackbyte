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
  
      const { title } = params;
  
      const project = await prisma.project.findFirst({
        where: {
          title,
          month: {
            course: {
              user: {
                clerkId: user.id,
              },
            },
          },
        },
      });
  
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
  
      return NextResponse.json({ project }, { status: 200 });
    } catch (error) {
      console.error("Error fetching project:", error);
      return NextResponse.json({ error: "Error occurred while fetching project" }, { status: 500 });
    }
  }
  
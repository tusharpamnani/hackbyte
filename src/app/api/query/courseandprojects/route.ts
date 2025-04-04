import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import getPrismaClient from "../../../../lib/prisma";

const prisma = getPrismaClient();

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  try {
    const user = await currentUser();
    console.log("user", user.id);
    if (!user) {
      return NextResponse.json({ error: "Not Signed In" }, { status: 401 });
    }

    // 📥 Extract data from request body
    const body = await request.json();
    console.log("body", body);
    const { title, description, batches } = body;

    if (!title || !description || !batches || !Array.isArray(batches)) {
      return NextResponse.json(
        { error: "Incomplete or invalid data" },
        { status: 400 }
      );
    }

    // const isCourseAvailable = await prisma.course.findFirst({
    //   where: {
    //     title,
    //   },
    // });
    

    // if (isCourseAvailable)
    //   return NextResponse.json(
    //     { message: "Course, batches, and projects Already Exists." },
    //     { status: 202 }
    //   );

    // 🏗️ Step 1: Create Course
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

    if (!newCourse)
      return NextResponse.json({error : "Course not created"}, {status : 400});

    // console.log(newCourse)

    // 🏗️ Step 2: Bulk Insert Batches
    const batchData = batches.map((batch, index) => ({
      number: batch.number || index,
      courseId: newCourse.id,
    }));

    // console.log(batchData);

    const newbatches = await prisma.batch.createMany({
      data: batchData,
    });

    if (!newbatches)
      return NextResponse.json({error : "batches not created"}, {status : 400});

    // Step 3: Retrieve batch IDs for linking projects
    const storedBatches = await prisma.batch.findMany({
      where: {
        courseId: newCourse.id,
      },
    });

    if (!storedBatches)
      return NextResponse.json({error : "batch stores not found"}, {status : 400});


    // 🏗️ Step 4: Bulk Insert Projects
    const projectData = batches.flatMap((batch) => {
      const batchRecord = storedBatches.find(
        (b) => { return Number(b.number) === Number(batch.batchId) }
      );
      
      // console.log("batchRecord", batchRecord);

      return batch.projects.map((project, index) => ({
        title: project.title,
        position : index,
        description: project.description,
        level: project.level,
        status: project.status || 'not started',
        batchId: batchRecord?.id,
        learningObjectives: project.learningObjectives || {},
        steps: project.steps || null,
        GithubData: project.GithubData || null,
      }));
    });

    const createProjects = await prisma.project.createMany({
      data: projectData,
    });

    if(!createProjects)
      return NextResponse.json({error : "Projects not created"}, {status : 400});


    // ✅ Return success response
    return NextResponse.json(
      { message: "Course, batches, and projects uploaded successfully." },
      { status: 201 }
    );

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error uploading course:", err?.message || err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
  
}

"use server";

import { prisma } from "../../../../lib/prisma";
import { GetUserIdByName } from "../user";

export async function GetBatchesByUserIdAndCourseName(
  id: string,
  courseName: string
) {
  if (!id) {
    throw new Error("GetUserByUserId: Provided id is invalid or undefined");
  }
  console.log("id, courseName", id, courseName);
  const response = await prisma.course.findFirst({
    where: {
      userId: id,
      title: courseName,
    },
    select: {
      id: true,
      title: true,
      status: true,
      batch: {
        select: {
          id: true,
          githubProjectId: true,
          status: true,
          number: true,
          projects: {
            select: {
              title: true,
              id: true,
              status: true,
              level: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!response) {
    throw new Error("Courses not found in Course");
  }

  return response;
}

export async function getBatchesByUserNameandCourseName(
  userName: string,
  courseName: string
) {
  const userId = await GetUserIdByName(userName);
  if (!userId) {
    throw Error("User Id Not Found");
  }
  const batches = await GetBatchesByUserIdAndCourseName(userId, courseName);

  if (!batches) {
    throw Error("Course not found");
  }
  return batches;
}

export async function getBatchProjectsByBatchId(BatchId: string) {
  const batch = await prisma.batch.findUnique({
    where: {
      id: BatchId,
    },
    select: {
      id: true,
      projects: {
        select: {
          id: true,
          title: true,
          githubRepo: true,
          description: true,
          level: true,
          status: true,
          position: true,
          learningObjectives: true,
          steps: true,
          GithubData: true,
        },
      },
    },
  });
  return batch;
}


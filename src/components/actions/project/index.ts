"use server"

import { prisma } from "../../../../lib/prisma"

export async function GetProjectByProjectId(id : string) {
  if (!id) {
    throw new Error("GetProjectById: Provided id is invalid or undefined");
  }
  const response = prisma.project.findFirst({
    where: {
      id: id,
    }
  });
  if (!response) {
    throw new Error("Project not found in Clerk");
  }
  return response;
}

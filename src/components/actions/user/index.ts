/* eslint-disable  @typescript-eslint/no-explicit-any */

"use server"

import { prisma } from "../../../../lib/prisma"

export async function GetUserByUserId(id : string) {
  if (!id) {
    throw new Error("GetUserByUserId: Provided id is invalid or undefined");
  }
  const response = prisma.user.findFirst({
    where: {
      clerkId: id
    }
  });
  if (!response) {
    throw new Error("User not found in Clerk");
  }
  return response;
}

export async function GetUserByUserName(userName : string) {
  if (!userName) {
    throw new Error("GetUserByUserName: Provided userName is invalid or undefined");
  }
  const response = await prisma.user.findFirst({
    where: {
      userName: userName
    }
  });

  if (!response) {
    throw new Error("User not found in Clerk");
  }
  
  return response;
}

export async function UpdateUserDetails(id : string, data : any) {
  if (!id) {
    throw new Error("UpdateUserDetails: Provided userName is invalid or undefined");
  }
  const response = await prisma.user.update({
    where: {
      id: id
    },
    data: {
      name: data.name,
      lastName: data.lastName
    }
  });
  if (!response) {
    throw new Error("User not found in Clerk");
  }
  return response;
}

export async function GetUserIdByName(userName : string){
  const res = await GetUserByUserName(userName);
  return res.id;
}
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import getPrismaClient from "../../../lib/prisma";
import { GithubTokenExtract } from "../../../utils/github/GithubBackchodi";
import { getOwnerId } from "../../../utils/github/GithubProjectBackchodi";
import { use } from "react";

const prisma = getPrismaClient();

async function fetchClerkUser(userId: string) {
  const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLERK_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user from Clerk");
  }

  return response.json();
}

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clerkUser = await fetchClerkUser(userId);

    if (!clerkUser || clerkUser.id !== userId) {
      return NextResponse.json(
        { error: "User not found in Clerk" },
        { status: 404 }
      );
    }

    const githubToken = await GithubTokenExtract(userId);

    const githubId = clerkUser.username;

    const githubOwnerid = await getOwnerId("user", githubId, githubToken);

    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: clerkUser.email_addresses?.[0]?.email_address || "",
        githubToken : githubToken,
        githubOwnerid : githubOwnerid,
        userName: clerkUser.username,
        githubId : githubId,
      },
      create: {
        clerkId: userId,
        name: clerkUser.first_name || "",
        lastName: clerkUser.last_name || "",
        avatar : clerkUser.avatar,
        email: clerkUser.email_addresses?.[0]?.email_address || "",
        userName: clerkUser.username,
        githubToken : githubToken,
        githubOwnerid : githubOwnerid,
        githubId : githubId,
      },
      select: { id: true },
    });

    if (!dbUser)
      return NextResponse.json(
        { error: "User not found in DB" },
        { status: 404 }
      );

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

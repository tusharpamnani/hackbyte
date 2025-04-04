import { NextResponse } from "next/server";
import { CodeQLDataGenerator } from "../../../../../utils/github/CodeQLBackchodi";
import { PushAndActivateCodeQL } from "../../../../../utils/github/githubPushBackchodi";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!id || !owner || !repo) {
      return NextResponse.json(
        { error: "id, owner, and repo are required" },
        { status: 400 }
      );
    }

    const ymlCode = await CodeQLDataGenerator(owner, repo, id);

    console.log("Generated CodeQL:", ymlCode);

    const codeqlPush = await PushAndActivateCodeQL(owner, repo, id, ymlCode);

    if (!codeqlPush) 
      return NextResponse.json({ error: "Error pushing CodeQL" }, { status: 500 });

    return NextResponse.json({ ymlCode }, { status: 200 });
    
  } catch (error) {
    console.error("Error generating CodeQL:", error);
    return NextResponse.json({ error: "Error occurred" }, { status: 500 });
  }
}

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PROMPT_GITHUB } from "../../../../utils/prompt";
import { GithubDataCollect } from "../../../../utils/github/GithubBackchodi";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-001",
  temperature: 0,
  apiKey: process.env.GEMINI_API_KEY2,
  verbose: true,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", PROMPT_GITHUB as string],
  [
    "human",
    `title : {title}, 
    learning_objectives : {learning_objectives}, 
    steps : {steps}, 
    github_repo_commit_data : {github_repo_commit_data}`,
  ],
]);


const outputParser = new StringOutputParser();

const chain = prompt.pipe(llm).pipe(outputParser);


export async function POST(req: Request) {
  try {
    const { id, owner, repo, topic, learning_objectives, steps } = await req.json();

    const github_repo_commit_data = await GithubDataCollect(id, owner, repo);
    if (!github_repo_commit_data) {
      return NextResponse.json({ error: "Failed to evaluate the repository." }, { status: 500 });
    }

    const res = await chain.invoke({
      title : topic,
      learning_objectives,
      steps,
      github_repo_commit_data
    });

    const { jsonObject, text } = separateJSONandText(res);

    return NextResponse.json({ jsonObject, text }, {status : 200});

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

function separateJSONandText(data: string): { jsonObject: string; text: string } {
    const jsonMatches = data.match(/```json([\s\S]*?)```/g);
    const jsonObject = jsonMatches ? jsonMatches.map(match => match.replace(/```json|```/g, "").trim()).join("\n") : "";
    const text = data.replace(/```json([\s\S]*?)```/g, "").trim();
    return { jsonObject, text };
  }
  
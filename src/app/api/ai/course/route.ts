import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PROMPT_COURSE } from "../../../../utils/prompt";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-001",
  temperature: 0,
  apiKey: process.env.GEMINI_API_KEY2,
  verbose: true,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", PROMPT_COURSE as string],
  [
    "human",
    `Generate a learning roadmap for:
    - Topic: {topic}
    - Duration: {time_duration} (in months)
    - Prefered Level : {level}
    - Proior Knowladge : {description}
    `,
  ],
]);

const outputParser = new StringOutputParser();

const chain = prompt.pipe(llm).pipe(outputParser);

export async function POST(req: Request) {
  try {
    const { topic, time_duration, level, description } = await req.json();

    const res = await chain.invoke({
      topic,
      time_duration,
      level,
      description
    });

    const { jsonObject, text } = separateJSONandText(res);

    return NextResponse.json({ jsonObject, text });

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

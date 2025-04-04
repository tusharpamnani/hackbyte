import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextResponse } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PROMPT_PROJECT } from "../../../../utils/prompt";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
  maxTokens: 8192,
  apiKey: process.env.GROQ_API_KEY,
  verbose: true,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", PROMPT_PROJECT as string],
]);

const output_parsers = new StringOutputParser();

const chain = prompt.pipe(llm).pipe(output_parsers);

export async function POST(req: Request) {
  try {
    const { topic, learning_objectives } = await req.json();

    const res = await chain.invoke({
      topic,
      learning_objectives,
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
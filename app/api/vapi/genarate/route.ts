import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { type, role, level, techstack, amount, userid } =
      await request.json();

    //HARD SAFETY LIMIT 
    const questionCount = Math.min(Number(amount) || 5, 15);

    const QuestionsSchema = z.object({
      questions: z.array(z.string()).max(questionCount),
    });

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: QuestionsSchema,
      temperature: 0,
    //   maxTokens: 800, //  prevents runaway responses
      prompt: `
Generate EXACTLY ${questionCount} interview questions.

Rules:
- Return ONLY valid JSON
- No markdown
- No backticks
- No explanations
- No extra text
- Each item must be a plain sentence

Context:
Role: ${role}
Level: ${level}
Tech stack: ${techstack}
Focus: ${type}
`,
    });

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t: string) => t.trim()),
      questions: object.questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/vapi/generate ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error?.finishReason === "length"
            ? "AI response was too long. Please try again."
            : error?.message ?? "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}

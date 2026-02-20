import { feedbackSchema } from "@/constants";
import { auth, db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { success } from "zod";
export async function getInterviewById(
  userId: String,
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getLatestInterview(
  params: GetLatestInterviewsParams,
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;
  const interviews = await db
    .collection("interviews")
    .where("finalized", "==", true)
    .orderBy("createdAt", "desc")
    .where("userID", "!=", "userId")
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewByUserId(
  id: string,
): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (s: { role: string; content: string }) => `- ${s.role}: ${s.content}`,
      )
      .join("\n");

    const { object:{totalScore,categoryScores,strengths,areasForImprovement,finalAssessment}} = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: feedbackSchema,
      system:
        "You are a professional interviewer analyzing a mock interview. Return ONLY valid JSON matching the schema.",
      prompt: `
You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.

Transcript:
${formattedTranscript}

Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
- Communication Skills
- Technical Knowledge
- Problem Solving
- Cultural Fit
- Confidence and Clarity
      `,
    });

    
const feedback = await db.collection('feedback').add({
  interviewId,
  userId,
  totalScore,
  strengths,
  categoryScores,
  areasForImprovement,
  finalAssessment,
  createdAt: new Date().toISOString()

})

return{
  success:true,
  feedbackId : feedback.id
}

  } catch (e) {
    console.error("Error saving feedback!", e);
    return null;
  }
}

import { Mistral } from "@mistralai/mistralai";
import CEFR_PROMPTS from "@/config/cefr-prompts";

const mistralApiKey = process.env.EXPO_PUBLIC_MISTRAL_API_KEY!;
const client = new Mistral({ apiKey: mistralApiKey });

export const evaluateResponse = async (
  level: string,
  userResponse: string
): Promise<string | null> => {
  try {
    if (!CEFR_PROMPTS[level]) {
      throw new Error(`Unsupported CEFR level: ${level}`);
    }

    const prompt = `
    CEFR Level: ${level}
    User Response: ${userResponse}

    ${CEFR_PROMPTS[level].evaluationCriteria}

    Provide a detailed evaluation including:
    1. Overall language proficiency score (0-100)
    2. Strengths in the response
    3. Areas for improvement
    4. Suggested CEFR sub-level (e.g., A1.1, A1.2)
    `;

    const chatCompletion = await client.chat.complete({
      model: "open-mistral-nemo",
      messages: [{ role: "user", content: prompt }],
    });

    if (chatCompletion.choices && chatCompletion.choices.length > 0) {
      const content = chatCompletion.choices[0].message.content;
      return typeof content === "string" ? content : null;
    }

    return null;
  } catch (error) {
    console.error("Mistral AI Evaluation Error:", error);
    return null;
  }
};

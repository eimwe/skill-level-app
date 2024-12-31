import { Mistral } from "@mistralai/mistralai";
import { CEFR_PROMPTS, createEvaluationPrompt } from "@/config/prompts";
import { SYSTEM_ROLE, ASSISTANT_ROLE } from "@/config/role-specifier";

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

    const evaluationPrompt = createEvaluationPrompt(
      level,
      userResponse,
      CEFR_PROMPTS
    );

    const chatCompletion = await client.chat.complete({
      model: "open-mistral-nemo",
      messages: [
        {
          role: "system",
          content: SYSTEM_ROLE,
        },
        {
          role: "assistant",
          content: ASSISTANT_ROLE,
        },
        { role: "user", content: evaluationPrompt },
      ],
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

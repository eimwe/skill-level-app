import { Mistral } from "@mistralai/mistralai";

type ContentChunk = {
  content: string;
};

interface CEFRPrompt {
  tasks: string[];
  evaluationCriteria: string;
}

const mistralApiKey = process.env.EXPO_PUBLIC_MISTRAL_API_KEY!;

const mistral = new Mistral({
  apiKey: mistralApiKey ?? "",
});

// CEFR Level Prompt Templates
const CEFR_PROMPTS: Record<string, CEFRPrompt> = {
  A1: {
    tasks: [
      "Write a short introduction about yourself. Tell me your name, where you're from, and what you like to do.",
      "Describe your favorite day of the week and why you like it.",
    ],
    evaluationCriteria: `Evaluate the response based on A1 level criteria:
    - Uses basic vocabulary
    - Simple, short sentences
    - Basic grammatical structures
    - Limited but clear communication`,
  },
  A2: {
    tasks: [
      "Describe your family and your daily routine.",
      "Write about a recent holiday or trip you took.",
    ],
    evaluationCriteria: `Evaluate the response based on A2 level criteria:
    - More complex sentence structures
    - Basic connecting words
    - Ability to describe simple scenarios
    - Some variety in vocabulary`,
  },
  B1: {
    tasks: [
      "Describe a challenging situation you faced and how you overcame it.",
      "Discuss the pros and cons of living in a big city versus a small town.",
    ],
    evaluationCriteria: `Evaluate the response based on B1 level criteria:
    - Connected, coherent paragraphs
    - More advanced vocabulary
    - Ability to express opinions
    - Complex sentence structures`,
  },
  // Add more levels (B2, C1, C2) with similar structure
};

export const evaluateResponse = async (
  level: string,
  userResponse: string
): Promise<string | null> => {
  try {
    const mistralApiKey = process.env.EXPO_PUBLIC_MISTRAL_API_KEY ?? "";

    const mistral = new Mistral({
      apiKey: mistralApiKey,
    });

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

    const chatCompletion = await mistral.chat.complete({
      model: "mistral-small",
      messages: [{ role: "user", content: prompt }],
    });

    /*if (chatCompletion.choices) {
      return chatCompletion.choices[0].message.content;
    }*/
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

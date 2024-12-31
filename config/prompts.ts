import { ICEFRPrompt } from "@/types";

export const CEFR_PROMPTS: Record<string, ICEFRPrompt> = {
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
  B2: {
    tasks: [
      "Write a review of a book, movie, or restaurant.",
      "Discuss a current event or social issue.",
    ],
    evaluationCriteria: `Evaluate the response based on B2 level criteria:
    - Clear and well-structured arguments
    - A wide range of vocabulary
    - Ability to use different registers and styles
    - Complex grammatical structures`,
  },
  C1: {
    tasks: [
      "Write a persuasive essay on a controversial topic.",
      "Imagine you are a famous historical figure. Write a diary entry about a significant event in your life.",
    ],
    evaluationCriteria: `Evaluate the response based on C1 level criteria:
    - Sophisticated language use
    - Ability to express nuanced ideas
    - Effective use of rhetorical devices
    - A high degree of accuracy in grammar and vocabulary`,
  },
  C2: {
    tasks: [
      "Write a formal letter or report.",
      "Write a creative piece of writing, such as a short story or poem.",
    ],
    evaluationCriteria: `Evaluate the response based on C2 level criteria:
    - Mastery of the language
    - Ability to produce clear, well-structured, and effective texts
    - A wide range of vocabulary and grammatical structures
    - The ability to adapt to different writing styles and registers`,
  },
};

export const createEvaluationPrompt = (
  level: string,
  userResponse: string,
  CEFR_PROMPTS: { [key: string]: ICEFRPrompt }
): string => {
  if (!CEFR_PROMPTS[level]) {
    throw new Error(`Unsupported CEFR level: ${level}`);
  }

  return `
    CEFR Level: ${level}
    Evaluation Task: ${CEFR_PROMPTS[level].tasks}
    User Response: ${userResponse}

    ${CEFR_PROMPTS[level].evaluationCriteria}

    Provide a detailed evaluation including:
    1. Overall language proficiency score (0-100)
    2. Strengths in the response
    3. Areas for improvement
    4. Suggested CEFR sub-level (e.g., A1.1, A1.2)
  `;
};

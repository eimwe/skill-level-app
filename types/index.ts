export type Tables = {
  user_sessions: {
    id: number;
    level: string;
    response: string;
    created_at: string;
  };
  evaluation_results: {
    id: number;
    session_id: number;
    final_level: string;
    score: number;
    evaluated_at: string;
  };
};

export type SupabaseInsertResponse<T> = {
  data: T[] | null;
  error: Error | null;
};

export interface ICEFRPrompt {
  tasks: string[];
  evaluationCriteria: string;
}

export type EvaluationResult = {
  score: number;
  cefr: string;
  feedback: {
    strengths: string[];
    areas_for_improvement: string[];
    suggested_sub_level: string;
  };
};

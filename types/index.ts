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
    feedback: {
      strengths: string[];
      areas_for_improvement: string[];
      suggested_sub_level: string;
    };
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

export type DetailedResult = Tables["evaluation_results"] & {
  user_session: Tables["user_sessions"];
  feedback: string;
};

export type ParsedFeedback = {
  strengths: string[];
  areas_for_improvement: string[];
  suggested_sub_level: string;
};

export interface IValidationRule {
  test: (value: string) => boolean;
  errorMessage: string;
}

export interface IValidationField {
  value: string; // The value to validate
  rules: IValidationRule[]; // Array of validation rules
  fieldName: string; // The name of the field (for error messages)
}

export interface IValidationResult {
  isValid: boolean;
  error: string | null;
}

export type TestResult = Tables["evaluation_results"] & {
  user_session: Tables["user_sessions"];
};

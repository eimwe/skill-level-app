export type Tables = {
  user_sessions: {
    id: number;
    level: string;
    responses: string;
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

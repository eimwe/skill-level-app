import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Tables, SupabaseInsertResponse } from "../types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
  },
});

export const saveUserSession = async (
  levelChosen: string,
  responses: any[]
): Promise<Tables["user_sessions"][] | null> => {
  const { data, error } = (await supabase.from("user_sessions").insert({
    level: levelChosen,
    responses: JSON.stringify(responses),
    created_at: new Date().toISOString(),
  })) as SupabaseInsertResponse<Tables["user_sessions"]>;

  if (error) console.error("Error saving session:", error);
  return data;
};

export const saveEvaluationResult = async (
  sessionId: number,
  finalLevel: string,
  score: number
): Promise<Tables["evaluation_results"][] | null> => {
  const { data, error } = (await supabase.from("evaluation_results").insert({
    session_id: sessionId,
    final_level: finalLevel,
    score: score,
    evaluated_at: new Date().toISOString(),
  })) as SupabaseInsertResponse<Tables["evaluation_results"]>;

  if (error) console.error("Error saving evaluation:", error);
  return data;
};

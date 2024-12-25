import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Tables } from "@/types";

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
  response: string
): Promise<Tables["user_sessions"][] | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("user_sessions").insert({
    user_id: user.id,
    level: levelChosen,
    response: JSON.stringify(response),
    created_at: new Date().toISOString(),
  });

  if (error) console.error("Error saving session:", error);
  return data;
};

export const saveEvaluationResult = async (
  sessionId: number | null,
  finalLevel: string,
  score: number,
  feedback: string
): Promise<Tables["evaluation_results"][] | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("evaluation_results").insert({
    user_id: user.id,
    session_id: sessionId,
    final_level: finalLevel,
    score: score,
    feedback: feedback,
    evaluated_at: new Date().toISOString(),
  });

  if (error) console.error("Error saving evaluation:", error);
  return data;
};

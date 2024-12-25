import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/services/supabase-config";
import { CEFR_PROMPTS } from "@/config/prompts";
import type { DetailedResult, ParsedFeedback } from "@/types";

export default function TestResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<DetailedResult | null>(null);
  const [parsedFeedback, setParsedFeedback] = useState<ParsedFeedback | null>(
    null
  );
  const [userResponse, setUserResponse] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResultDetails();
  }, [id]);

  useEffect(() => {
    if (result?.feedback) {
      try {
        const parsed = JSON.parse(result.feedback) as ParsedFeedback;
        setParsedFeedback(parsed);
      } catch (error) {
        console.error("Error parsing feedback:", error);
      }
    }
  }, [result?.feedback]);

  const fetchResultDetails = async () => {
    const { data, error } = await supabase
      .from("evaluation_results")
      .select(
        `
        *,
        user_sessions (
          id,
          level,
          response
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching result:", error);
    } else if (data) {
      setResult(data as DetailedResult);
      if (data.user_sessions) {
        try {
          const parsedResponse = JSON.parse(data.user_sessions.response);
          setUserResponse(parsedResponse);
        } catch (error) {
          console.error("Error parsing user response:", error);
          setUserResponse(data.user_sessions.response);
        }
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.container}>
        <Text>Result not found</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Result Details</Text>
        <Text style={styles.date}>
          {new Date(result.evaluated_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Task Section */}
      {result.final_level && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Task Instructions:</Text>
          {CEFR_PROMPTS[result.final_level].tasks.map((task, index) => (
            <Text key={index} style={styles.taskText}>
              {index + 1}. {task}
            </Text>
          ))}
        </View>
      )}

      {/* User Response Section */}
      {userResponse && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Your Response:</Text>
          <Text style={styles.responseText}>{userResponse}</Text>
        </View>
      )}

      {/* Evaluation Result Card */}
      <View style={styles.resultCard}>
        <Text style={styles.sectionTitle}>Evaluation Feedback:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Level:</Text>
          <Text style={styles.value}>{result.final_level}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Score:</Text>
          <Text style={styles.value}>{result.score}/100</Text>
        </View>

        {/* Strengths */}
        {parsedFeedback?.strengths && (
          <View style={[styles.row, styles.feedbackSection]}>
            <Text style={styles.label}>Strengths:</Text>
            <View style={styles.feedbackList}>
              {parsedFeedback.strengths.map((strength, index) => (
                <Text key={index} style={styles.feedbackItem}>
                  • {strength}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Areas for Improvement */}
        {parsedFeedback?.areas_for_improvement && (
          <View style={[styles.row, styles.feedbackSection]}>
            <Text style={styles.label}>Areas for Improvement:</Text>
            <View style={styles.feedbackList}>
              {parsedFeedback.areas_for_improvement.map((area, index) => (
                <Text key={index} style={styles.feedbackItem}>
                  • {area}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Suggested Sublevel */}
        {parsedFeedback?.suggested_sub_level && (
          <View style={styles.row}>
            <Text style={styles.label}>Suggested Sublevel:</Text>
            <Text style={styles.value}>
              {parsedFeedback.suggested_sub_level}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back to Account</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/")}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Go to Home
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: "#666",
  },
  resultCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
  },
  responseSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  response: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#007bff",
  },
  secondaryButtonText: {
    color: "#007bff",
  },
  feedbackSection: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  feedbackList: {
    width: "100%",
    marginTop: 8,
  },
  feedbackItem: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    paddingLeft: 8,
  },
  sectionCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  taskText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    lineHeight: 24,
  },
  responseText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
});

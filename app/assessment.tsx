import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { validateInputs, isNotEmpty } from "@/services/field-validator";

import {
  saveUserSession,
  saveEvaluationResult,
} from "@/services/supabase-config";
import { evaluateResponse } from "@/services/mistral-service";
import { CEFR_PROMPTS } from "@/config/prompts";
import type { EvaluationResult } from "@/types";

export default function AssessmentScreen() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const [userResponse, setUserResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] =
    useState<EvaluationResult | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    const fields = [
      { value: userResponse, rules: [isNotEmpty], fieldName: "Response" },
    ];

    const { isValid, error } = validateInputs(fields);

    if (!isValid) {
      Alert.alert("Validation Error", error!);
      return;
    }

    try {
      setIsSubmitting(true);
      const currentLevel = level || "Level unavailable";

      const result = await evaluateResponse(currentLevel, userResponse);
      let parsedResult = null;

      if (result) {
        parsedResult = JSON.parse(result);
        setEvaluationResult(parsedResult);
      } else {
        setEvaluationResult({
          score: 0,
          cefr: "No CEFR level available",
          feedback: {
            strengths: [],
            areas_for_improvement: [],
            suggested_sub_level: "No evaluation result available.",
          },
        });
      }

      // Save session and results to Supabase
      const sessionData = await saveUserSession(currentLevel, userResponse);
      const sessionId = sessionData?.id ?? null;

      await saveEvaluationResult(
        sessionId,
        currentLevel,
        parsedResult.score,
        parsedResult.feedback
      );
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Submission error:", error);
      setEvaluationResult({
        score: 0,
        cefr: "No CEFR level available",
        feedback: {
          strengths: [],
          areas_for_improvement: [],
          suggested_sub_level: "No evaluation result available.",
        },
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.levelText}>English Proficiency Level: {level}</Text>
      {CEFR_PROMPTS[level].tasks.map((task, index) => (
        <Text style={styles.promptText} key={index}>
          {index + 1}. {task}
        </Text>
      ))}
      <TextInput
        multiline
        placeholder="Write your response here..."
        value={userResponse}
        onChangeText={setUserResponse}
        style={styles.input}
      />
      <Button
        title="Submit response"
        onPress={handleSubmit}
        disabled={isSubmitting}
        color="#007bff"
      />

      {/* Render evaluation result if available */}
      {evaluationResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Evaluation Result:</Text>

          {/* Score */}
          <Text style={styles.resultText}>
            <Text style={styles.bold}>Score: </Text>
            {evaluationResult.score}/100
          </Text>

          {/* CEFR Level */}
          <Text style={styles.resultText}>
            <Text style={styles.bold}>CEFR Level: </Text>
            {evaluationResult.cefr}
          </Text>

          {/* Strengths */}
          {evaluationResult.feedback.strengths && (
            <View style={styles.feedbackSection}>
              <Text style={styles.bold}>Strengths:</Text>
              {evaluationResult.feedback.strengths.map((strength, index) => (
                <Text key={index} style={styles.feedbackText}>
                  - {strength}
                </Text>
              ))}
            </View>
          )}

          {/* Areas for Improvement */}
          {evaluationResult.feedback.areas_for_improvement && (
            <View style={styles.feedbackSection}>
              <Text style={styles.bold}>Areas for Improvement:</Text>
              {evaluationResult.feedback.areas_for_improvement.map(
                (area, index) => (
                  <Text key={index} style={styles.feedbackText}>
                    - {area}
                  </Text>
                )
              )}
            </View>
          )}

          {/* Suggested Sublevel */}
          <Text style={styles.resultText}>
            <Text style={styles.bold}>Suggested Sublevel: </Text>
            {evaluationResult.feedback.suggested_sub_level}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back to Level Selection</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/account")}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Go to Account
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  levelText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  promptText: {
    fontSize: 16,
    marginBottom: 14,
    textAlign: "left",
  },
  input: {
    minHeight: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 16,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  resultContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  feedbackSection: {
    marginTop: 12,
  },
  feedbackText: {
    fontSize: 14,
    marginLeft: 8,
    marginTop: 4,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 24,
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
});

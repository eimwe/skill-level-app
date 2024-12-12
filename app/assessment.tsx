import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import {
  saveUserSession,
  saveEvaluationResult,
} from "../services/supabase-config";
import { evaluateResponse } from "../services/mistral-service";

export default function AssessmentScreen() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const [userResponse, setUserResponse] = useState("");
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      // Ensure level is a string and not undefined
      const currentLevel = level || "A1";

      const result = await evaluateResponse(currentLevel, userResponse);

      // Handle the result
      if (result) {
        setEvaluationResult(result);
      } else {
        setEvaluationResult("No evaluation result available.");
      }

      // Save session and results to Supabase
      const sessionData = await saveUserSession(currentLevel, [userResponse]);

      // Type-safe session ID extraction
      const sessionId =
        sessionData && sessionData.length > 0 ? sessionData[0].id : 0;

      await saveEvaluationResult(sessionId, currentLevel, 85); // Example score
    } catch (error) {
      console.error("Submission error:", error);
      setEvaluationResult("An error occurred during evaluation.");
    }
  };

  // Rest of the component remains the same
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.levelText}>English Proficiency Level: {level}</Text>
      <TextInput
        multiline
        placeholder="Write your response here..."
        value={userResponse}
        onChangeText={setUserResponse}
        style={styles.input}
      />
      <Button title="Submit" onPress={handleSubmit} />

      {evaluationResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Evaluation Result:</Text>
          <Text>{evaluationResult}</Text>
        </View>
      )}
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
  input: {
    height: 200,
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
});

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LevelSelectionScreen() {
  const router = useRouter();

  const LEVELS = [
    { code: "A1", label: "Beginner (A1)" },
    { code: "A2", label: "Beginner (A2)" },
    { code: "B1", label: "Intermediate (B1)" },
    { code: "B2", label: "Intermediate (B2)" },
    { code: "C1", label: "Advanced (C1)" },
    { code: "C2", label: "Advanced (C2)" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your English Proficiency Level</Text>
      {LEVELS.map((level) => (
        <Pressable
          key={level.code}
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/assessment",
              params: { level: level.code },
            })
          }
        >
          <Text style={styles.buttonText}>{level.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

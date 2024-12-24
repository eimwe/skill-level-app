import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import { supabase } from "@/services/supabase-config";
import type { Tables } from "@/types";

type TestResult = Tables["evaluation_results"] & {
  user_session: Tables["user_sessions"];
};

export default function AccountScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchTestResults();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUserEmail(data?.user?.email ?? null);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchTestResults = async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) throw userError;

      const { data, error } = await supabase
        .from("evaluation_results")
        .select(`*, user_session:user_sessions (*)`)
        .eq("user_id", userData.user.id)
        .order("evaluated_at", { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error("Error fetching test results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth" as RelativePathString);
  };

  const renderTestResult = ({ item }: { item: TestResult }) => (
    <Pressable
      style={styles.resultCard}
      onPress={() => router.push(`/result/${item.id}` as RelativePathString)}
    >
      <Text style={styles.resultLevel}>Level: {item.final_level}</Text>
      <Text style={styles.resultScore}>Score: {item.score}/100</Text>
      <Text style={styles.resultDate}>
        {new Date(item.evaluated_at).toLocaleDateString()}
      </Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Account</Text>
        <Text style={styles.email}>{userEmail}</Text>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Test Results</Text>

      {results.length === 0 ? (
        <Text style={styles.noResults}>No test results yet</Text>
      ) : (
        <FlatList
          data={results}
          renderItem={renderTestResult}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.resultsList}
        />
      )}
    </View>
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
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  signOutButton: {
    alignSelf: "flex-start",
  },
  signOutText: {
    color: "#007bff",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
  resultsList: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultLevel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  resultDate: {
    fontSize: 14,
    color: "#999",
  },
  noResults: {
    textAlign: "center",
    color: "#666",
    marginTop: 32,
  },
});
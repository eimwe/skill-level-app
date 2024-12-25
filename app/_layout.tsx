import { useEffect, useState } from "react";
import { RelativePathString, Stack, useRouter, useSegments } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { supabase } from "@/services/supabase-config";

function UserMenuButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/account" as RelativePathString)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        marginRight: 15,
      })}
    >
      <Text style={{ color: "#007bff", fontSize: 16 }}>Account</Text>
    </Pressable>
  );
}

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) {
        console.error("Session check error:", error);
        return;
      }
      if (!session && (segments[0] as string) === "auth") {
        router.replace("/auth" as RelativePathString);
      } else if (session && (segments[0] as string) === "auth") {
        router.replace("/");
      }
      setLoading(false);
    };

    checkSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session && (segments[0] as string) === "auth") {
          router.replace("/auth" as RelativePathString);
        } else if (session && (segments[0] as string) === "auth") {
          router.replace("/");
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4f4f4",
        },
        headerTintColor: "#333",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerRight: () => <UserMenuButton />,
        }}
      />
      <Stack.Screen
        name="level-selection"
        options={{
          title: "Select Level",
          headerRight: () => <UserMenuButton />,
        }}
      />
      <Stack.Screen
        name="assessment"
        options={{
          title: "Assessment",
          headerRight: () => <UserMenuButton />,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "My Account",
        }}
      />
      <Stack.Screen
        name="result/[id]"
        options={{
          title: "Test Result",
        }}
      />
    </Stack>
  );
}

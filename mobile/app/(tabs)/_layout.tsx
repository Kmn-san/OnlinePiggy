// app/(tabs)/_layout.tsx
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";

import i18n from "../../lib/i18n";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useLanguage } from "../../context/languageContext";
import LoadingComponent from "@/components/LoadingComponent";

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading: userLoading } = useCurrentUser({
    enabled: isLoaded && isSignedIn,
  });

  const { language } = useLanguage();
  const insets = useSafeAreaInsets();

  i18n.locale = language;

  if (!isLoaded || userLoading) {
    return (
      <LoadingComponent />
    )
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      key={language}
      screenOptions={{
        lazy: false,
        headerShown: false,
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#888888",
        tabBarStyle: {
          backgroundColor: "rgba(18,18,18,0.95)",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.1)",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom || 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: i18n.t("tabs.expenses"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: i18n.t("tabs.transactions"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: i18n.t("tabs.chat"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: i18n.t("tabs.menu"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
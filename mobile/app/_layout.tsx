import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../global.css";
import { LanguageProvider } from "@/context/languageContext";


const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        tokenCache={tokenCache}
      >
        <LanguageProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </LanguageProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
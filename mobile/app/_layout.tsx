import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../global.css";
import { LanguageProvider } from "@/context/languageContext";
import { StripeProvider } from "@stripe/stripe-react-native";


const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        tokenCache={tokenCache}
      >
        <LanguageProvider>
          <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
            <Stack screenOptions={{ headerShown: false }} />
          </StripeProvider>
        </LanguageProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
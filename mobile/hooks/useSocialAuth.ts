import { useOAuth, useAuth } from "@clerk/clerk-expo"; // 1. Import useAuth
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useCallback, useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import i18n from "@/lib/i18n";

WebBrowser.maybeCompleteAuthSession();

type OAuthStrategy = "oauth_google" | "oauth_apple";

export default function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<OAuthStrategy | null>(null);
  
  const { getToken } = useAuth(); // 2. Extract getToken

  const googleOAuth = useOAuth({
    strategy: "oauth_google",
    redirectUrl: Linking.createURL("/(tabs)", { scheme: "mobile" }),
  });

  const appleOAuth = useOAuth({
    strategy: "oauth_apple",
    redirectUrl: Linking.createURL("/(tabs)", { scheme: "mobile" }),
  });

  const handleSocialAuth = useCallback(
    async (strategy: OAuthStrategy) => {
      const provider = strategy === "oauth_google" ? googleOAuth : appleOAuth;

      try {
        setLoadingStrategy(strategy);

        const { createdSessionId, setActive } = await provider.startOAuthFlow();

        if (createdSessionId && setActive) {
          await setActive({
            session: createdSessionId,
          });

          // 3. Grab and log the Clerk Bearer Token for Postman!
          try {
            const token = await getToken();
            console.log("========================================");
            console.log("🔑 CLERK BEARER TOKEN FOR POSTMAN:");
            console.log(token);
            console.log("========================================");
          } catch (tokenError) {
            console.error("Failed to fetch token:", tokenError);
          }

          router.replace("/(tabs)");
        }
      } catch (err) {
        console.error("OAuth Error:", err);

        Alert.alert(
          i18n.t("common.error"),
          i18n.t("auth.socialLoginFailed", {
            provider: strategy === "oauth_google" ? "Google" : "Apple",
          })
        );
      } finally {
        setLoadingStrategy(null);
      }
    },
    [googleOAuth, appleOAuth, getToken]
  );

  return {
    loadingStrategy,
    handleSocialAuth,
  };
}
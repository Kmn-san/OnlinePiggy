import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useCallback, useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import i18n from "@/lib/i18n";

WebBrowser.maybeCompleteAuthSession();

type OAuthStrategy = "oauth_google" | "oauth_apple";

export default function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] =
    useState<OAuthStrategy | null>(null);

  const googleOAuth = useOAuth({
    strategy: "oauth_google",
    redirectUrl: Linking.createURL("/(tabs)", {
      scheme: "mobile",
    }),
  });

  const appleOAuth = useOAuth({
    strategy: "oauth_apple",
    redirectUrl: Linking.createURL("/(tabs)", {
      scheme: "mobile",
    }),
  });

  const handleSocialAuth = useCallback(
    async (strategy: OAuthStrategy) => {
      const provider =
        strategy === "oauth_google" ? googleOAuth : appleOAuth;

      try {
        setLoadingStrategy(strategy);

        const { createdSessionId, setActive } =
          await provider.startOAuthFlow();

        if (createdSessionId && setActive) {
          await setActive({
            session: createdSessionId,
          });

          router.replace("/(tabs)");
        }
      } catch (err) {
        console.error("OAuth Error:", err);

        Alert.alert(
          i18n.t("common.error"),
          i18n.t("auth.socialLoginFailed", {
            provider:
              strategy === "oauth_google" ? "Google" : "Apple",
          })
        );
      } finally {
        setLoadingStrategy(null);
      }
    },
    [googleOAuth, appleOAuth]
  );

  return {
    loadingStrategy,
    handleSocialAuth,
  };
}
// app/(tabs)/Menu.js
import { useAuth } from "@clerk/clerk-expo";
import { Text, View, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../lib/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useLanguage } from "../../context/languageContext";
import { useLayoutEffect } from "react";

export default function Menu() {
  const { user, deleteUser, isLoading } = useCurrentUser();
  const { signOut, getToken } = useAuth();
  const { language } = useLanguage();
  const navigation = useNavigation();

  i18n.locale = language;

  const currency = user?.currency ?? "MYR";
  const isPremium = user?.is_premium ?? false;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t("tabs.menu"),
    });
  }, [language, navigation]);

  const handlePrintToken = async () => {
    try {
      const token = await getToken();
      console.log("========================================");
      console.log("🔑 CLERK BEARER TOKEN FOR POSTMAN:");
      console.log(token);
      console.log("========================================");
      Alert.alert("Token Logged", "Check your Metro terminal console for your Bearer token.");
    } catch (error) {
      console.error("Error getting token:", error);
      Alert.alert("Error", "Failed to retrieve token.");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      i18n.t("auth.signOut"),
      i18n.t("auth.signOutConfirm"),
      [
        {
          text: i18n.t("common.cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("auth.signOut"),
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch {
              Alert.alert(
                i18n.t("common.error"),
                "Failed to sign out"
              );
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      i18n.t("auth.deleteAccount", { defaultValue: "Delete Account" }),
      i18n.t("auth.deleteAccountConfirm", {
        defaultValue: "Are you sure you want to delete your account? This action is permanent and will erase all your data."
      }),
      [
        {
          text: i18n.t("common.cancel", { defaultValue: "Cancel" }),
          style: "cancel",
        },
        {
          text: i18n.t("common.delete", { defaultValue: "Delete" }),
          style: "destructive",
          onPress: async () => {
            try {
              deleteUser(undefined, {
                onSuccess: async () => {
                  await signOut();
                },
                onError: (error) => {
                  console.error("Failed to delete account:", error);
                  Alert.alert(
                    i18n.t("common.error"),
                    i18n.t("auth.deleteAccountError", { defaultValue: "Failed to delete account. Please try again." })
                  );
                }
              });
            } catch (error) {
              console.error("Failed to delete account:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView key={language} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: "space-between" }}>
        <View>
          {/* Profile */}
          <TouchableOpacity
            className="bg-gray-50 rounded-2xl p-4 mb-4"
            onPress={() => router.push("/settings/profile")}
          >
            <View className="flex-row items-center">
              <Image
                source={{
                  uri:
                    user?.avatar_url ??
                    "https://ui-avatars.com/api/?name=User",
                }}
                className="w-20 h-20 rounded-full bg-gray-200"
              />

              <View className="flex-1 ml-4">
                <Text className="text-xl font-bold text-gray-800">
                  {user?.username ?? "User"}
                </Text>

                <Text className="text-gray-500 mt-1">
                  OnlinePiggy ID
                </Text>

                <Text className="text-gray-400 text-sm">
                  {user?.opid}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#9CA3AF"
              />
            </View>
          </TouchableOpacity>

          {/* Settings */}
          <View className="bg-gray-50 rounded-2xl p-4 mb-4">
            {/* Language */}
            <TouchableOpacity
              className="flex-row items-center justify-between py-3 border-b border-gray-200"
              onPress={() => router.push("/settings/language")}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="globe-outline"
                  size={24}
                  color="#4B5563"
                />

                <Text className="text-gray-700 text-base ml-3">
                  {i18n.t("menu.language")}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text className="text-gray-600 mr-2">
                  {i18n.t(`languages.${language}.short`)}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                />
              </View>
            </TouchableOpacity>

            {/* Currency */}
            <TouchableOpacity
              className="flex-row items-center justify-between py-3 border-b border-gray-200"
              onPress={() => router.push("/settings/currency")}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="cash-outline"
                  size={24}
                  color="#4B5563"
                />

                <Text className="text-gray-700 text-base ml-3">
                  {i18n.t("currency.title")}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text className="text-gray-600 mr-2">
                  {currency}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                />
              </View>
            </TouchableOpacity>

            {/* Premium Section */}
            <TouchableOpacity
              className="flex-row items-center justify-between py-3"
              onPress={() => router.push("/settings/premium")}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="diamond-outline"
                  size={24}
                  color="#8B5CF6"
                />

                <Text className="text-gray-700 text-base ml-3">
                  {i18n.t("premium.header.title")}
                </Text>

                {isPremium && (
                  <View className="ml-2 bg-purple-100 px-2 py-0.5 rounded-full">
                    <Text className="text-purple-700 text-xs font-semibold">
                      {i18n.t("premium.labels.activeTag")}
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row items-center">
                {!isPremium && (
                  <View className="bg-purple-500 px-3 py-1 rounded-full mr-2">
                    <Text className="text-white text-xs font-semibold">
                      {i18n.t("premium.labels.basicTag")}
                    </Text>
                  </View>
                )}
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions Section */}
        <View className="mt-8 mb-4">
          {/* Debug Button for Postman Token */}
          <TouchableOpacity
            onPress={handlePrintToken}
            className="bg-indigo-600 px-8 py-3 rounded-full flex-row items-center justify-center mb-3"
            activeOpacity={0.7}
          >
            <Ionicons
              name="key-outline"
              size={20}
              color="white"
            />
            <Text className="text-white font-bold text-base ml-2">
              Print Bearer Token
            </Text>
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 px-8 py-4 rounded-full flex-row items-center justify-center mb-3"
            activeOpacity={0.7}
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color="white"
            />

            <Text className="text-white font-bold text-lg ml-2">
              {i18n.t("auth.signOut")}
            </Text>
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="py-3 flex-row items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#EF4444"
            />
            <Text className="text-red-500 font-semibold text-base ml-2">
              {i18n.t("auth.deleteAccount", { defaultValue: "Delete Account" })}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
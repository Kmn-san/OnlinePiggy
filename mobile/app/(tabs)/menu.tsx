// app/(tabs)/Menu.js
import { useAuth } from "@clerk/clerk-expo";
import { Text, View, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../lib/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useLanguage } from "../../context/languageContext";
import { useLayoutEffect } from "react"; // Removed useState and useEffect

export default function Menu() {
  const { user } = useCurrentUser();
  const { signOut } = useAuth();
  const { language } = useLanguage();
  const navigation = useNavigation();

  i18n.locale = language;

  const currency = user?.currency ?? "MYR";

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t("tabs.menu"),
    });
  }, [language, navigation]);

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

  return (
    <SafeAreaView key={language} className="flex-1 bg-white p-4">
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
          className="flex-row items-center justify-between py-3"
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
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 px-8 py-4 rounded-full flex-row items-center justify-center mt-auto"
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
    </SafeAreaView>
  );
}
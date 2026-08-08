// app/(tabs)/Menu.js
import { useAuth } from "@clerk/clerk-expo";
import { Text, View, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../lib/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useLanguage } from "../../context/languageContext";
import { useLayoutEffect, useState } from "react";
import AppInfoModal from "@/components/AppInfoModal";
import { MenuRowProps } from "@/types";

// Reusable Menu Row Component for cleaner layout
const MenuRow = ({ icon, color, title, value, showBorder = true, onPress }: MenuRowProps) => (
  <TouchableOpacity
    className={`flex-row items-center justify-between py-3.5 px-4 ${showBorder ? "border-b border-gray-100" : ""
      }`}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className="flex-row items-center">
      <View className="p-2 rounded-xl bg-gray-100 mr-3">
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-gray-800 text-base font-medium">{title}</Text>
    </View>

    <View className="flex-row items-center">
      {value && <Text className="text-gray-500 mr-2 text-sm">{value}</Text>}
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </View>
  </TouchableOpacity>
);

export default function Menu() {
  const { user, deleteUser } = useCurrentUser();
  const { signOut } = useAuth();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
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

  const handleLogout = () => {
    Alert.alert(
      i18n.t("auth.signOut"),
      i18n.t("auth.signOutConfirm"),
      [
        { text: i18n.t("common.cancel"), style: "cancel" },
        {
          text: i18n.t("auth.signOut"),
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch {
              Alert.alert(i18n.t("common.error"), "Failed to sign out");
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
        { text: i18n.t("common.cancel", { defaultValue: "Cancel" }), style: "cancel" },
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
    <SafeAreaView key={language} className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-5 shadow-sm border border-gray-100 flex-row items-center"
          onPress={() => router.push("/settings/profile")}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri: user?.avatar_url ?? "https://ui-avatars.com/api/?name=User",
            }}
            className="w-16 h-16 rounded-full bg-gray-200"
          />

          <View className="flex-1 ml-4">
            <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
              {user?.username ?? "User"}
            </Text>
            <Text className="text-xs text-gray-400 mt-0.5">OnlinePiggy ID</Text>
            <Text className="text-gray-500 text-xs font-mono mt-0.5" numberOfLines={1}>
              {user?.opid}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Section: Preferences */}
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
          Preferences
        </Text>
        <View className="bg-white rounded-2xl mb-5 shadow-sm border border-gray-100 overflow-hidden">
          <MenuRow
            icon="globe-outline"
            color="#4B5563"
            title={i18n.t("menu.language")}
            value={i18n.t(`languages.${language}.short`)}
            onPress={() => router.push("/settings/language")}
          />
          <MenuRow
            icon="cash-outline"
            color="#4B5563"
            title={i18n.t("currency.title")}
            value={currency}
            onPress={() => router.push("/settings/currency")}
          />
          <MenuRow
            icon="diamond-outline"
            color="#8B5CF6"
            title={i18n.t("premium.header.title")}
            value={isPremium ? i18n.t("premium.labels.activeTag") : i18n.t("premium.labels.basicTag")}
            showBorder={false}
            onPress={() => router.push("/settings/premium")}
          />
        </View>

        {/* Section: About & Privacy */}
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
          About & Transparency
        </Text>
        <View className="bg-white rounded-2xl mb-6 shadow-sm border border-gray-100 overflow-hidden">
          <MenuRow
            icon="information-circle-outline"
            color="#059669"
            title="App Data & Services Info"
            showBorder={false}
            onPress={() => setInfoModalVisible(true)}
          />
        </View>

        {/* Actions Section */}
        <View className="space-y-3">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 py-3.5 rounded-xl flex-row items-center justify-center border border-red-100"
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-500 font-semibold text-base ml-2">
              {i18n.t("auth.signOut")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="py-3 flex-row items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color="#9CA3AF" />
            <Text className="text-gray-400 font-medium text-sm ml-2">
              {i18n.t("auth.deleteAccount", { defaultValue: "Delete Account" })}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Component */}
      <AppInfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
    </SafeAreaView>
  );
}
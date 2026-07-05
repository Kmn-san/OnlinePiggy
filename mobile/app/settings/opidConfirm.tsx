import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import i18n from "../../lib/i18n";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function ConfirmOpid() {
  const { user } = useCurrentUser();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={28}
            color="black"
          />
        </TouchableOpacity>

      </View>

      <View className="flex-1 px-6 pt-10">
        {/* Logo */}
        <View className="items-center">
          <View className="w-40 h-40 rounded-full border-4 border-green-500 items-center justify-center bg-white shadow-sm">
            <Image
              source={require("@/assets/images/icon.png")}
              className="w-32 h-32"
              resizeMode="contain"
              borderRadius={34}
            />
          </View>

          <Text className="text-sm text-gray-500 mt-6">
            OnlinePiggy ID
          </Text>

          <Text className="text-3xl font-bold text-gray-900 mt-2">
            {user?.opid}
          </Text>
        </View>

        {/* Warning */}
        <View className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mt-10">
          <View className="flex-row">
            <Ionicons
              name="warning-outline"
              size={22}
              color="#D97706"
            />

            <Text className="flex-1 ml-3 text-base leading-7 text-gray-700">
              {i18n.t("profile.opidWarning")}
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={() => router.push("/settings/edit-opid")}
          className="bg-green-600 rounded-xl py-4 mt-auto mb-8"
        >
          <Text className="text-center text-white text-lg font-semibold">
            {i18n.t("common.confirm")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
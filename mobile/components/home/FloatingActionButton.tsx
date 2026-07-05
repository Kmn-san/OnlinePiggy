import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "@/lib/i18n";

export function FloatingActionButton() {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      className="absolute left-6 right-6 bg-emerald-600 rounded-xl py-3.5 shadow-md shadow-emerald-700/20 active:opacity-90"
      onPress={() => router.push("/accounts/createGoal")}
      style={{ bottom: 24 + insets.bottom }}
    >
      <View className="flex-row items-center justify-center">
        <Ionicons name="add" size={20} color="white" />
        <Text className="text-white text-base font-semibold ml-1.5">
          {i18n.t("savings.goalAccount")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
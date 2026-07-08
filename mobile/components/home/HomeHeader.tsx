import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../lib/i18n";
import { formatCurrency } from "@/constants/currency";
import { HomeHeaderProps } from "@/types";

export function HomeHeader({ totalBalance, primaryCurrency, accountCount }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#059669", "#047857"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="px-4 pb-6"
      style={{ paddingTop: insets.top + 16 }}
    >
      {/* Top Brand Row */}
      <View className="flex-row items-center justify-between mx-2">
        <View className="flex-row items-center">
          <Image
            source={require("@/assets/images/icon.png")}
            className="w-12 h-12 rounded-full border-2 border-white/30"
            resizeMode="contain"
          />
          <View className="ml-4 pl-1">
            <Text className="text-white text-xl font-bold tracking-tight">
              OnlinePiggy
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="w-12 h-12 rounded-full bg-white/20 items-center justify-center"
          onPress={() => { /* router.push("/notifications") */ }}
        >
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Financial Summary Card */}
      <View className="mt-6 mx-2 bg-white/20 rounded-2xl p-5">
        <Text className="text-white/80 text-sm font-medium mb-1">
          {i18n.t("savings.totalSavings")}
        </Text>
        <Text className="text-white text-3xl font-bold tracking-tight">
          {formatCurrency(totalBalance, primaryCurrency)}
        </Text>
        <View className="flex-row items-center mt-2">
          <View className="bg-emerald-400/30 px-3 py-1 rounded-full">
            <Text className="text-emerald-50 text-xs font-semibold">
              {accountCount} {i18n.t("savings.SAVINGS")}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
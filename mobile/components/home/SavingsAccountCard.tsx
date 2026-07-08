import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import i18n from "../../lib/i18n";
import { formatCurrency } from "@/constants/currency";
import { SavingsAccountCardProps } from "@/types";

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

const getAccountIcon = (type: string): IoniconsName => {
  switch (type) {
    case "GOAL":
      return "flag-outline";
    case "SAVINGS":
      return "business-outline";
    default:
      return "wallet-outline";
  }
};

const getLocalizedType = (type: string): string => {
  switch (type) {
    case "WORKING_CAPITAL":
      return i18n.t("savings.WORKING_CAPITAL");
    case "EMERGENCY_CAPITAL":
      return i18n.t("savings.EMERGENCY_CAPITAL");
    case "SAVINGS":
      return i18n.t("savings.SAVINGS");
    case "GOAL":
      return i18n.t("savings.goalAccount");
    default:
      return type;
  }
};

export function SavingsAccountCard({ item }: SavingsAccountCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100"
      activeOpacity={0.7}
      onPress={() => router.push({
        pathname: "/accounts/[id]",
        params: { id: item.id },
      })}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-emerald-50 items-center justify-center mr-3">
            <Ionicons
              name={getAccountIcon(item.type)}
              size={24}
              color="#059669"
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 text-lg font-bold">
              {item.type === "GOAL"
                ? item.name
                : i18n.t(`savings.${item.name}`)}
            </Text>
            <View className="flex-row items-center mt-0.5">
              <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
                <Text className="text-emerald-700 text-xs font-medium">
                  {getLocalizedType(item.type)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>

      <View className="mt-4 pt-4 border-t border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-500 text-sm">
            {i18n.t("savings.currentBalance")}
          </Text>
          <Text className="text-gray-900 text-xl font-bold">
            {formatCurrency(item.current_balance, item.currency)}
          </Text>
        </View>

        {item.type === "GOAL" && item.target_amount && (
          <View className="mt-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-gray-500 text-xs">{i18n.t("savings.progress")}</Text>
              <Text className="text-gray-600 text-xs font-medium">
                {Math.min(Math.round((Number(item.current_balance) / Number(item.target_amount)) * 100), 100)}%
              </Text>
            </View>
            <View className="w-full bg-gray-200 rounded-full h-2">
              <View
                className="bg-emerald-500 rounded-full h-2"
                style={{
                  width: `${Math.min((item.current_balance / item.target_amount) * 100, 100)}%`
                }}
              />
            </View>
            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-gray-400 text-xs">
                {formatCurrency(0, item.currency)}
              </Text>
              <Text className="text-gray-600 text-xs font-medium">
                {i18n.t("savings.target")}: {formatCurrency(item.target_amount, item.currency)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
import { View, Text } from "react-native";
import i18n from "../../lib/i18n";
import { HomeSectionTitleProps } from "@/types";

export function HomeSectionTitle({ count }: HomeSectionTitleProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pt-6 pb-3">
      <Text className="text-gray-900 text-lg font-bold">
        {i18n.t("savings.YOUR_SAVINGS_ACCOUNTS")}
      </Text>
      <Text className="text-emerald-600 text-sm font-medium">
        {count}
      </Text>
    </View>
  );
}
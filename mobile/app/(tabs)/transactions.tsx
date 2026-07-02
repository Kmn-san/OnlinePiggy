import { View, Text } from "react-native";
import { Tabs } from "expo-router";
import i18n from "../../lib/i18n";
import { useLanguage } from "../../context/languageContext";

export default function Transactions() {
  const { language } = useLanguage();
  i18n.locale = language;

  return (
    <View className="flex-1 bg-white">
      <Tabs.Screen options={{ title: i18n.t("tabs.transactions") }} />

      <Text>Transactions</Text>
    </View>
  );
}
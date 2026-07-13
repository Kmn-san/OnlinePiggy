import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../../lib/i18n";
import { useLanguage } from "../../context/languageContext";
import PageHeader from "@/components/PageHeader";

const languages = [
  { code: "en" },
  { code: "ja" },
  { code: "zh" },
] as const;

export default function LanguageScreen() {
  const { language, setLanguage } = useLanguage();

  const handleChangeLanguage = async (lang: "en" | "ja" | "zh") => {
    await setLanguage(lang);
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <PageHeader title={i18n.t("menu.language")} />

      {/* Language List */}
      <View className="p-5">
        {languages.map((item) => (
          <TouchableOpacity
            key={item.code}
            onPress={() => handleChangeLanguage(item.code)}
            className={`flex-row items-center justify-between p-5 rounded-xl mb-3 border ${language === item.code
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
              }`}
          >
            <View>
              <Text className="text-lg font-semibold">
                {i18n.t(`languages.${item.code}.native`)}
              </Text>

              {item.code !== language && (
                <Text className="text-gray-500">
                  {i18n.t(`languages.${item.code}.translated`)}
                </Text>
              )}
            </View>

            {language === item.code && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#22C55E"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
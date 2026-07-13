import PageHeader from "@/components/PageHeader";
import useCurrentUser from "../../hooks/useCurrentUser";
import i18n from "../../lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const currencies = ["MYR", "JPY", "CNY"] as const;

export default function CurrencyScreen() {
  const { user, updateCurrency } = useCurrentUser();

  const handleSelectCurrency = (currency: string) => {
    if (currency === user?.currency) {
      router.back();
      return;
    }

    updateCurrency.mutate(
      { currency },
      {
        onSuccess: () => {
          router.back();
        }
      }
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <PageHeader title={i18n.t("currency.title")} />

      {/* Currency List */}
      <View className="p-5">
        {currencies.map((currency) => {
          const selected = user?.currency === currency;

          return (
            <TouchableOpacity
              key={currency}
              disabled={updateCurrency.isPending}
              className={`flex-row items-center justify-between p-5 rounded-xl mb-3 border ${selected
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
                }`}
              onPress={() => handleSelectCurrency(currency)}
            >
              <Text className="text-lg">
                {i18n.t(`currency.${currency}`)}
              </Text>

              {selected && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#22C55E"
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
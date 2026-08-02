import PageHeader from "@/components/PageHeader";
import useCurrentUser from "../../hooks/useCurrentUser";
import i18n from "../../lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";

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
        onSuccess: (data) => {
          const code = data?.code;

          if (code === "UPDATE_SUCCESS") {
            Alert.alert(i18n.t("common.success"),
              i18n.t("success.profileUpdated")
              , [
                {
                  onPress: () => router.back()
                }
              ])
          } else {
            router.back()
          }
        },
        onError: (error: any) => {
          const code = error.response?.data?.code;
          const errorHandlers: Record<string, () => void> = {
            INTERNAL_SERVER_ERROR: () =>
              Alert.alert(i18n.t("common.error"), i18n.t("errorDetial.INTERNAL_SERVER_ERROR")),

            USER_NOT_FOUND: () =>
              Alert.alert(i18n.t("error.notFound"), i18n.t("errorDetial.USER_NOT_FOUND")),

            NO_DATA_PROVIDED: () =>
              Alert.alert(i18n.t("error.noDataGiven"), i18n.t("errorDetial.NO_DATA_PROVIDED")),
          };

          if (code && errorHandlers[code]) {
            errorHandlers[code]();
          } else {
            Alert.alert(i18n.t("common.error"), i18n.t("errorDetail.UNKNOWN_ERROR"));
          }
        }
      }
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <PageHeader title={i18n.t("currency.title")} />

      {/* Currency List */}
      <View className="p-5 flex-1">

        <Text className="text-gray-500 text-sm mb-4">
          {i18n.t("currency.changeNotice", { defaultValue: "Selecting a currency will update your base currency immediately." })}
        </Text>
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
      {/* API Attribution Footer */}
      <View className="pb-8 pt-4 items-center">
        <Text className="text-xs text-gray-400 font-medium">
          {i18n.t("currency.poweredBy", { defaultValue: "Exchange rates powered by" })}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          exchange-rates7.p.rapidapi.com
        </Text>
      </View>
    </View>
  );
}
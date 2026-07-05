import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "../../lib/i18n";

interface ExpensesHeaderProps {
  totalExpenses: number;
  primaryCurrency: string;
  categoryCount: number;
}

const formatCurrency = (amount: number, currency: string): string => {
  const safeAmount = isNaN(amount) || !amount ? 0 : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(safeAmount);
};

export function ExpensesHeader({ totalExpenses, primaryCurrency, categoryCount }: ExpensesHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#DC2626", "#B91C1C"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="px-6 pb-6"
      style={{ paddingTop: insets.top + 16 }}
    >
      {/* Title View */}
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold tracking-tight ml-2">
          {i18n.t("tabs.expenses")}
        </Text>
      </View>

      {/* Total Expenses Card */}
      <View className="mt-5 bg-white/20 rounded-2xl p-5 backdrop-blur-sm">
        <Text className="text-white/80 text-sm font-medium mb-1">Total Expenses</Text>
        <Text className="text-white text-3xl font-bold tracking-tight">
          {formatCurrency(totalExpenses, primaryCurrency)}
        </Text>
        <View className="flex-row items-center mt-2">
          <View className="bg-red-400/30 px-2.5 py-1 rounded-full">
            <Text className="text-red-50 text-xs font-semibold">
              {categoryCount} Categories
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
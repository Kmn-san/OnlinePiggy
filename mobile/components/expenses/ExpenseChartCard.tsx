import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DonutChart } from "../DonutChart";
import i18n from "@/lib/i18n";
import { formatCurrency } from "@/constants/currency";

interface ExpenseChartCardProps {
  categoryData: any[];
  totalExpenses: number;
  primaryCurrency: string;
}

export function ExpenseChartCard({ categoryData, totalExpenses, primaryCurrency }: ExpenseChartCardProps) {
  if (categoryData.length === 0) {
    return (
      <View className="bg-white mx-4 mt-6 rounded-2xl p-8 shadow-sm border border-gray-100 items-center">
        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="pie-chart-outline" size={40} color="#9ca3af" />
        </View>
        <Text className="text-gray-900 text-lg font-bold">{i18n.t("expenses.noExpensesData")}</Text>
        <Text className="text-gray-500 text-sm mt-1 text-center">
          {i18n.t("expenses.noExpensesDataDetial")}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white mx-4 mt-6 rounded-2xl p-6 shadow-sm border border-gray-100">
      <Text className="text-gray-900 text-lg font-bold text-center mb-4">Expense Breakdown</Text>
      <DonutChart 
        data={categoryData} 
        total={totalExpenses} 
        formatter={(amt) => formatCurrency(amt, primaryCurrency)} 
      />
    </View>
  );
}
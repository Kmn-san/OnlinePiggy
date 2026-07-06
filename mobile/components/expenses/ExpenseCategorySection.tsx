import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import i18n from "@/lib/i18n";
import { formatCurrency } from "@/constants/currency";

interface ExpenseCategorySectionProps {
    categoryData: any[];
    totalExpenses: number;
    primaryCurrency: string;
}

export function ExpenseCategorySection({ categoryData, totalExpenses, primaryCurrency }: ExpenseCategorySectionProps) {
    return (
        <View className="px-4 mt-6">
            <Text className="text-gray-900 text-lg font-bold mb-3">{i18n.t("expenses.expensesCategory")}</Text>
            {categoryData.length > 0 ? (
                categoryData.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
                        activeOpacity={0.7}
                        onPress={() => router.push({
                            pathname: "/accounts/[id]",
                            params: { id: category.id },
                        })}
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center flex-1">
                                <View style={{ backgroundColor: category.color + '20' }} className="w-12 h-12 rounded-full items-center justify-center mr-3">
                                    <Ionicons name={category.icon} size={22} color={category.color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 text-lg font-bold">{category.label}</Text>
                                    <Text className="text-gray-500 text-sm" numberOfLines={1}>
                                        {category.accounts.length} accounts • {category.accounts.map((a: any) => a.name).join(', ')}
                                    </Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-gray-900 text-lg font-bold">
                                    {formatCurrency(category.value, primaryCurrency)}
                                </Text>
                                <Text className="text-gray-400 text-xs">
                                    {totalExpenses > 0 ? Math.round((category.value / totalExpenses) * 100) : 0}%
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View className="bg-white rounded-2xl p-8 items-center border border-gray-100">
                    <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
                    <Text className="text-gray-400 text-center mt-2">{i18n.t("expenses.noExpensesAccount")}</Text>
                </View>
            )}
        </View>
    );
}
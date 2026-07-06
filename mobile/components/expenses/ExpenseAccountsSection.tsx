import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import i18n from "@/lib/i18n";
import { formatCurrency } from "@/constants/currency";

interface Account {
    id: string;
    name: string;
    type: string;
    currency: string;
    current_balance: number;
}

interface ExpenseAccountsSectionProps {
    expenseAccounts: Account[];
}


export function ExpenseAccountsSection({ expenseAccounts }: ExpenseAccountsSectionProps) {
    if (expenseAccounts.length === 0) return null;

    return (
        <View className="px-4 mt-4">
            <Text className="text-gray-900 text-lg font-bold mb-3">{i18n.t("expenses.All_EXPENSES")}</Text>
            {expenseAccounts.map((account) => (
                <TouchableOpacity
                    key={account.id}
                    className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
                    activeOpacity={0.7}
                    onPress={() => router.push({
                        pathname: "/accounts/[id]",
                        params: { id: account.id },
                    })}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center mr-3">
                                <Ionicons name="cash-outline" size={20} color="#DC2626" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-bold">{i18n.t(`expenses.${account.name}`)}</Text>
                                <Text className="text-gray-400 text-xs">{i18n.t(`expenses.${account.type}`)}</Text>
                            </View>
                        </View>
                        <Text className="text-gray-900 font-bold">
                            {formatCurrency(account.current_balance, account.currency)}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}
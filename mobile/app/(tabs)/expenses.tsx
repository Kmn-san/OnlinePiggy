import { View, Text, ActivityIndicator, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import i18n from "../../lib/i18n";
import { useLanguage } from "../../context/languageContext";
import useAccounts from "../../hooks/useAccounts";
import { EXPENSE_CATEGORIES, getCategoryForAccount } from "../../constants/expenseCategorires";

// New Extracted Sub-Components
import { ExpensesHeader } from "../../components/expenses/ExpensesHeader";
import { ExpenseChartCard } from "../../components/expenses/ExpenseChartCard";
import { ExpenseCategorySection } from "../../components/expenses/ExpenseCategorySection";
import { ExpenseAccountsSection } from "../../components/expenses/ExpenseAccountsSection";

interface Account {
  id: string;
  name: string;
  type: string;
  currency: string;
  current_balance: number;
  target_amount?: number;
}

export default function Expenses() {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  i18n.locale = language;
  
  const { data: accounts, isLoading } = useAccounts();

  // Data processing logic kept isolated here at root context level
  const expenseAccounts = accounts?.filter((a: Account) => a.type !== "SAVINGS" && a.type !== "GOAL") || [];
  const primaryCurrency = expenseAccounts[0]?.currency || "USD";

  const categoryData = EXPENSE_CATEGORIES.map(category => {
    const accountsInCategory = expenseAccounts.filter(a => getCategoryForAccount(a.name) === category.id);
    const total = accountsInCategory.reduce((sum, a) => sum + (a.current_balance || 0), 0);
    return { ...category, value: total, accounts: accountsInCategory };
  }).filter(cat => cat.value > 0);

  const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <Tabs.Screen options={{ title: i18n.t("tabs.expenses"), headerShown: false }} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#DC2626" />
          <Text className="text-gray-500 mt-3 text-sm">Loading expenses...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          
          <ExpensesHeader 
            totalExpenses={totalExpenses} 
            primaryCurrency={primaryCurrency} 
            categoryCount={categoryData.length} 
          />

          <ExpenseChartCard 
            categoryData={categoryData} 
            totalExpenses={totalExpenses} 
            primaryCurrency={primaryCurrency} 
          />

          <ExpenseCategorySection 
            categoryData={categoryData} 
            totalExpenses={totalExpenses} 
            primaryCurrency={primaryCurrency} 
          />

          <ExpenseAccountsSection 
            expenseAccounts={expenseAccounts} 
          />

        </ScrollView>
      )}

      {/* Modern Fixed Action Accent Button */}
      <TouchableOpacity 
        className="absolute left-5 right-5 bg-red-600 rounded-xl py-3.5 shadow-md shadow-red-700/20 active:opacity-90" 
        style={{ bottom: 24 }}
        activeOpacity={0.8} 
        onPress={() => router.push("/expenses/create-expense")}
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white text-base font-semibold ml-1.5">Add Expense Account</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
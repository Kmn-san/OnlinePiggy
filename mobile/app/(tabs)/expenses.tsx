// app/expenses/index.tsx
import { View, StatusBar, ScrollView, TouchableOpacity, Text, Modal } from "react-native";
import { useState } from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

import i18n from "../../lib/i18n";
import { useLanguage } from "../../context/languageContext";
import useAccounts from "../../hooks/useAccounts";
import useTransactions from "../../hooks/useTransactions";
import { EXPENSE_CATEGORIES, getCategoryForAccount } from "../../constants/expenseCategorires";

import { ExpensesHeader } from "../../components/expenses/ExpensesHeader";
import { ExpenseChartCard } from "../../components/expenses/ExpenseChartCard";
import { ExpenseCategorySection } from "../../components/expenses/ExpenseCategorySection";
import LoadingComponent from "@/components/LoadingComponent";

interface Account {
  id: string;
  name: string;
  type: string;
  currency: string;
  current_balance: number;
  target_amount?: number;
}

interface Transaction {
  id: string;
  amount: string;
  created_at: string;
  from_account_id: string | null;
  to_account_id: string;
  note: string;
  type: string;
  userid: string;
  updated_at: string;
}

export default function Expenses() {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  i18n.locale = language;

  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false); // 👈 Controls month grid visibility

  const expenseAccounts = accounts?.filter((a: Account) => a.type !== "SAVINGS" && a.type !== "GOAL") || [];
  const primaryCurrency = expenseAccounts[0]?.currency || "USD";

  // Extrapolate available transaction months
  const getAvailableMonths = (): string[] => {
    if (!transactions) return [];
    const months = new Set<string>();
    transactions.forEach((t: Transaction) => {
      const date = new Date(t.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    // Ensure current month is always available even if there are no transactions yet
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    months.add(currentMonthKey);

    return Array.from(months).sort((a, b) => b.localeCompare(a));
  };

  const availableMonths = getAvailableMonths();

  const getFilteredTransactions = (): Transaction[] => {
    if (!transactions) return [];
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    return transactions.filter((t: Transaction) => {
      const date = new Date(t.created_at);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const getExpenseAmounts = (): { [key: string]: number } => {
    const categoryTotals: { [key: string]: number } = {};

    filteredTransactions.forEach((t: Transaction) => {
      let categoryId: string | null = null;

      if (t.to_account_id && String(t.to_account_id).startsWith('exp-')) {
        categoryId = t.to_account_id;
      } else if (t.to_account_id) {
        const matchingAccount = expenseAccounts.find(a => a.id === t.to_account_id);
        if (matchingAccount) {
          categoryId = getCategoryForAccount(matchingAccount.name);
        }
      }

      if (categoryId) {
        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = 0;
        }
        categoryTotals[categoryId] += Number(t.amount || 0);
      }
    });

    return categoryTotals;
  };

  const expenseTotals = getExpenseAmounts();

  const categoryData = EXPENSE_CATEGORIES.map(category => {
    const accountsInCategory = expenseAccounts.filter(
      (a: Account) => getCategoryForAccount(a.name) === category.id
    );
    const total = expenseTotals[category.id] || 0;
    return { ...category, value: total, accounts: accountsInCategory };
  }).filter(cat => cat.value > 0);

  const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  const formatMonthDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isLoading = isAccountsLoading || isTransactionsLoading;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <Tabs.Screen options={{ title: i18n.t("tabs.expenses"), headerShown: false }} />

      {isLoading ? (
        <LoadingComponent />
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: insets.bottom + 130 }} showsVerticalScrollIndicator={false}>
          
          <ExpensesHeader
            totalExpenses={totalExpenses}
            primaryCurrency={primaryCurrency}
            categoryCount={categoryData.length}
          />

          {/* 📅 Modern Month Grid Trigger Row */}
          <View className="px-4 mt-4 pb-2">
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              className="flex-row items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-center space-x-3">
                <View className="bg-red-50 p-2 rounded-xl">
                  <Ionicons name="calendar-outline" size={20} color="#DC2626" />
                </View>
                <View className="ml-3">
                  <Text className="text-gray-400 text-xs font-medium">Selected Period</Text>
                  <Text className="text-gray-900 font-bold text-base mt-0.5">
                    {formatMonthDisplay(selectedMonth)}
                  </Text>
                </View>
              </View>
              <View className="bg-gray-50 px-3 py-1.5 rounded-xl flex-row items-center">
                <Text className="text-gray-600 text-xs font-semibold mr-1">Change</Text>
                <Ionicons name="chevron-down" size={14} color="#4b5563" />
              </View>
            </TouchableOpacity>
          </View>

          {/* 📊 Grid Modal Selector Overlay */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white rounded-t-3xl p-6" style={{ paddingBottom: insets.bottom + 24 }}>
                <View className="flex-row items-center justify-between mb-4 border-b border-gray-100 pb-3">
                  <Text className="text-gray-900 text-lg font-bold">Select Statement Month</Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} className="p-1">
                    <Ionicons name="close-circle" size={26} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                {/* The Month Table Grid Layout */}
                <View className="flex-row flex-wrap mx-[-6px]">
                  {availableMonths.map((monthKey) => {
                    const [year, month] = monthKey.split('-').map(Number);
                    const date = new Date(year, month - 1);
                    const isSelected = selectedMonth.getFullYear() === year && selectedMonth.getMonth() === month - 1;

                    return (
                      <View key={monthKey} className="w-1/3 p-[6px]">
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedMonth(date);
                            setIsModalVisible(false);
                          }}
                          className={`py-3 px-2 rounded-2xl items-center justify-center border ${
                            isSelected 
                              ? 'bg-red-500 border-red-500 shadow-sm shadow-red-200' 
                              : 'bg-gray-50 border-gray-100 active:bg-gray-100'
                          }`}
                        >
                          <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                          </Text>
                          <Text className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-red-100' : 'text-gray-400'}`}>
                            {year}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </Modal>

          {/* Charts & Categorized Ledger Sections */}
          {categoryData.length > 0 ? (
            <>
              <ExpenseChartCard categoryData={categoryData} totalExpenses={totalExpenses} primaryCurrency={primaryCurrency} />
              <ExpenseCategorySection categoryData={categoryData} totalExpenses={totalExpenses} primaryCurrency={primaryCurrency} />
            </>
          ) : (
            <View className="mx-4 mt-4 bg-white rounded-2xl p-8 items-center border border-gray-100">
              <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-900 text-lg font-bold mt-4">No expenses this month</Text>
              <Text className="text-gray-500 text-sm mt-1 text-center px-6">
                {formatMonthDisplay(selectedMonth)} has no expense transactions
              </Text>
            </View>
          )}

        </ScrollView>
      )}
    </View>
  );
}
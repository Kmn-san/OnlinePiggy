// app/expense/[id].tsx
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import useAccounts from '../../hooks/useAccounts';
import useTransactions from '../../hooks/useTransactions';
import LoadingComponent from '../../components/LoadingComponent';
import { useLanguage } from '../../context/languageContext';
import i18n from '../../lib/i18n';

import { Account, Transaction } from '../../types';
import { ExpenseDetailHeader } from '@/components/expenses/ExpensesDetialHeader';
import { ExpenseTransactionRow } from '@/components/expenses/ExpensesTransactionRow';

interface GroupedYear {
  year: string;
  transactions: Transaction[];
}

export default function ExpenseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language } = useLanguage();
  
  i18n.locale = language; // Synchronize internationalization locale context

  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);

  const expenseAccount = accounts?.find((acc: Account) => acc.id === id);

  useEffect(() => {
    if (transactions && id) {
      const filtered = transactions.filter(
        (t: Transaction) => t.from_account_id === id || t.to_account_id === id
      );
      setExpenseTransactions(filtered);
    }
  }, [transactions, id]);

  const stats = useMemo(() => {
    let spent = 0;
    let received = 0;
    expenseTransactions.forEach(t => {
      if (t.from_account_id === id) spent += Number(t.amount || 0);
      if (t.to_account_id === id) received += Number(t.amount || 0);
    });
    return { spent, received };
  }, [expenseTransactions, id]);

  // Group transactions by dynamic calendar year strings
  const groupedTransactions = useMemo((): GroupedYear[] => {
    const grouped: { [year: string]: Transaction[] } = {};

    expenseTransactions.forEach(t => {
      // Localized display year conversion string matching regional preferences
      const year = new Date(t.created_at).toLocaleDateString(i18n.locale, { year: 'numeric' });
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(t);
    });

    return Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .map(year => ({
        year,
        transactions: grouped[year].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }));
  }, [expenseTransactions, language]);

  if (isAccountsLoading) return <LoadingComponent />;

  if (!expenseAccount) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={60} color="#9ca3af" />
        <Text className="text-gray-900 text-lg font-bold mt-4">Expense not found</Text>
        <TouchableOpacity className="mt-6 bg-red-600 rounded-2xl px-8 py-3" onPress={() => router.back()}>
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ExpenseDetailHeader
        account={expenseAccount}
        onBack={() => router.back()}
      />

      <View className="flex-1 px-4 pt-4">
        <Text className="text-gray-900 text-lg font-bold mb-3">{i18n.t("expenses.DETIAL")}</Text>

        <FlatList
          data={groupedTransactions}
          keyExtractor={(item) => item.year}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item: yearGroup }) => (
            <View className="mb-4">
              {/* Year Heading Wrapper Block */}
              <View className="flex-row items-center mb-3">
                <View className="bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
                  <Text className="text-red-700 font-bold text-sm">{yearGroup.year}</Text>
                </View>
                <View className="flex-1 h-px bg-gray-200 ml-3" />
              </View>

              {/* Transactions List */}
              {yearGroup.transactions.map((t) => (
                <ExpenseTransactionRow
                  key={t.id}
                  transaction={t}
                  currentAccountId={id}
                  accountCurrency={expenseAccount.currency}
                  accountName={expenseAccount.name}
                  allAccounts={accounts}
                />
              ))}
            </View>
          )}
        />
      </View>
    </View>
  );
}
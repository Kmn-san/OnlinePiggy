import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import useAccounts from '../../hooks/useAccounts';
import useTransactions from '../../hooks/useTransactions';
import LoadingComponent from '../../components/LoadingComponent';
import { useLanguage } from '../../context/languageContext';
import i18n from '../../lib/i18n';

import { Account, Transaction } from '../../types';
import { groupTransactionsByYear } from '@/constants/utlis';
import { ExpenseDetailHeader } from '@/components/expenses/ExpensesDetialHeader';
import TransactionItem from '@/components/AccountDetial/TransactionItem';

export default function ExpenseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language } = useLanguage();

  i18n.locale = language;

  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);

  const expenseAccount = useMemo(() =>
    accounts?.find((acc: Account) => acc.id === id),
    [accounts, id]);

  useEffect(() => {
    if (transactions && id) {
      const filtered = transactions.filter(
        (t: Transaction) => t.from_account_id === id || t.to_account_id === id
      );
      setExpenseTransactions(filtered);
    }
  }, [transactions, id]);

  const groupedTransactions = useMemo(
    () => groupTransactionsByYear(expenseTransactions, i18n.locale),
    [expenseTransactions, language]
  );

  if (isAccountsLoading) return <LoadingComponent />;

  if (!expenseAccount) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={60} color="#9ca3af" />
        <Text className="text-gray-900 text-lg font-bold mt-4">
          {i18n.t('expenses.notFound', { defaultValue: 'Expense not found' })}
        </Text>
        <TouchableOpacity
          className="mt-6 bg-red-600 rounded-2xl px-8 py-3"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">
            {i18n.t('expenses.goBack', { defaultValue: 'Go Back' })}
          </Text>
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
        <Text className="text-gray-900 text-lg font-bold mb-3">
          {i18n.t("expenses.DETIAL", { defaultValue: 'Details' })}
        </Text>

        {isTransactionsLoading ? (
          <LoadingComponent />
        ) : (
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
                    <Text className="text-red-700 font-bold text-sm">
                      {yearGroup.year}
                    </Text>
                  </View>
                  <View className="flex-1 h-px bg-gray-200 ml-3" />
                </View>

                {/* Transactions List */}
                {yearGroup.transactions.map((t) => (
                  <TransactionItem
                    key={t.id}
                    transaction={t}
                    accountId={id as string}
                    accountCurrency={expenseAccount.currency}
                    accounts={accounts}
                  />
                ))}
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
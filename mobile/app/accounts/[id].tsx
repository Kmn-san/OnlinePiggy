import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/lib/i18n';

import useAccounts from '../../hooks/useAccounts';
import useTransactions from '../../hooks/useTransactions';
import LoadingComponent from '../../components/LoadingComponent';
import { Account, Transaction } from '@/types';
import { groupTransactionsByYear } from '@/constants/utlis';
import NotFoundState from '@/components/AccountDetial/NotFoundState';
import AccountHeader from '@/components/AccountDetial/AccountHeader';
import TransactionItem from '@/components/AccountDetial/TransactionItem';


const AccountDetail = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { accounts, isLoading: isAccountsLoading } = useAccounts();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();

  const [accountTransactions, setAccountTransactions] = useState<Transaction[]>([]);

  const account = useMemo(() =>
    accounts?.find((acc: Account) => acc.id === id),
    [accounts, id]);

  useEffect(() => {
    if (transactions && id) {
      const filtered = transactions.filter(
        (t: Transaction) => t.from_account_id === id || t.to_account_id === id
      );
      setAccountTransactions(filtered);
    }
  }, [transactions, id]);

  const groupedTransactions = useMemo(
    () => groupTransactionsByYear(accountTransactions, i18n.locale),
    [accountTransactions]
  );

  if (isAccountsLoading) {
    return <LoadingComponent />;
  }

  if (!account) {
    return <NotFoundState onBack={() => router.back()} />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <AccountHeader account={account} onBack={() => router.back()} topInset={insets.top} />

      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-900 text-lg font-bold">
            {i18n.t('accountDetail.transactions.title')}
          </Text>
          <Text className="text-gray-500 text-sm">
            {i18n.t('accountDetail.transactions.total', { count: accountTransactions.length })}
          </Text>
        </View>

        {isTransactionsLoading ? (
          <LoadingComponent />
        ) : accountTransactions.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="receipt-outline" size={60} color="#d1d5db" />
            <Text className="text-gray-900 text-lg font-bold mt-4">
              {i18n.t('accountDetail.transactions.empty.title')}
            </Text>
            <Text className="text-gray-500 text-sm mt-1 text-center px-6">
              {i18n.t('accountDetail.transactions.empty.subtitle')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={groupedTransactions}
            keyExtractor={(item) => item.year}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item: yearData }) => (
              <View className="mb-6">
                {/* Year Header */}
                <View className="flex-row items-center mb-3">
                  <View className="bg-emerald-100 px-4 py-2 rounded-full">
                    <Text className="text-emerald-700 font-bold text-base">
                      {yearData.year}
                    </Text>
                  </View>
                  <View className="flex-1 h-px bg-gray-200 ml-3" />
                  <Text className="text-gray-400 text-sm ml-3">
                    {i18n.t('accountDetail.transactions.count', { count: yearData.transactions.length })}
                  </Text>
                </View>

                {/* Transactions for this year */}
                {yearData.transactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    accountId={id as string}
                    accountCurrency={account.currency}
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
};

export default AccountDetail;
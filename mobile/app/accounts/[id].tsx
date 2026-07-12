import { View, Text, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

import useAccounts from '../../hooks/useAccounts'
import useTransactions from '../../hooks/useTransactions'
import LoadingComponent from '../../components/LoadingComponent'
import { Account, Transaction } from '@/types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { formatCurrency } from '@/constants/currency'
import { formatLocalizedDate } from '@/constants/expensesHelpers'
import i18n from '@/lib/i18n'

const AccountDetail = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { accounts, isLoading: isAccountsLoading } = useAccounts()
  const { transactions, isLoading: isTransactionsLoading } = useTransactions()
  const [accountTransactions, setAccountTransactions] = useState<Transaction[]>([])

  // Find the account
  const account = accounts?.find((acc: Account) => acc.id === id)
  // Filter transactions for this account
  useEffect(() => {
    if (transactions && id) {
      const filtered = transactions.filter(
        (t: Transaction) => t.from_account_id === id || t.to_account_id === id
      )
      setAccountTransactions(filtered)
    }
  }, [transactions, id])

  // Group transactions by year
  const groupTransactionsByYear = (transactions: Transaction[]) => {
    const grouped: { [year: string]: Transaction[] } = {}

    transactions.forEach(transaction => {
      const year = new Date(transaction.created_at).getFullYear().toString()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(transaction)
    })

    // Sort years in descending order (newest first)
    return Object.keys(grouped)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map(year => ({
        year,
        transactions: grouped[year].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }))
  }

  const groupedTransactions = groupTransactionsByYear(accountTransactions)


  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionType = (transaction: Transaction) => {
    if (transaction.from_account_id === id) {
      return 'expense'
    } else if (transaction.to_account_id === id) {
      return 'income'
    }
    return 'unknown'
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return 'arrow-down-circle'
      case 'expense':
        return 'arrow-up-circle'
      case 'SAVINGS':
        return 'save-outline'
      case 'EXPENSES':
        return 'card-outline'
      default:
        return 'cash-outline'
    }
  }

  const getTransactionBg = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-emerald-50'
      case 'expense':
        return 'bg-red-50'
      case 'SAVINGS':
        return 'bg-emerald-50'
      case 'EXPENSES':
        return 'bg-red-50'
      default:
        return 'bg-gray-50'
    }
  }

  const getTransactionLabel = (transaction: Transaction) => {
    if (transaction.from_account_id === id) {
      return 'Sent'
    } else if (transaction.to_account_id === id) {
      return 'Received'
    }
    return 'Transaction'
  }

  const getAccountName = (accountId: string | null) => {
    if (!accountId) return 'External'
    const acc = accounts?.find((a: Account) => a.id === accountId)
    return acc?.name || 'Unknown Account'
  }

  if (isAccountsLoading) {
    return <LoadingComponent />
  }

  if (!account) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={60} color="#9ca3af" />
        <Text className="text-gray-900 text-lg font-bold mt-4">Account not found</Text>
        <Text className="text-gray-500 text-sm mt-1">The account you're looking for doesn't exist</Text>
        <TouchableOpacity
          className="mt-6 bg-emerald-600 rounded-2xl px-8 py-3"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={["#059669", "#047857"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="px-4 pb-6"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-bold" numberOfLines={1}>
            {i18n.t(`savings.${account.name}`)}
          </Text>

          <View className="w-10" />
        </View>

        {/* Account Balance */}
        <View className="mt-4 bg-white/20 rounded-2xl p-4">
          <Text className="text-white/80 text-sm">Current Balance</Text>
          <Text className="text-white text-3xl font-bold mt-1">
            {formatCurrency(account.current_balance.toString(), account.currency)}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">
                {account.type}
              </Text>
            </View>
            {account.type === 'GOAL' && account.target_amount && (
              <View className="bg-white/20 px-3 py-1 rounded-full ml-2">
                <Text className="text-white text-xs font-semibold">
                  Target: {formatCurrency(account.target_amount.toString(), account.currency)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Transactions List */}
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-900 text-lg font-bold">
            Transactions
          </Text>
          <Text className="text-gray-500 text-sm">
            {accountTransactions.length} total
          </Text>
        </View>

        {isTransactionsLoading ? (
          <LoadingComponent />
        ) : accountTransactions.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="receipt-outline" size={60} color="#d1d5db" />
            <Text className="text-gray-900 text-lg font-bold mt-4">No transactions</Text>
            <Text className="text-gray-500 text-sm mt-1 text-center px-6">
              This account doesn't have any transactions yet
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
                    {yearData.transactions.length} transactions
                  </Text>
                </View>

                {/* Transactions for this year */}
                {yearData.transactions.map((transaction) => {
                  const transactionType = getTransactionType(transaction)
                  const isIncome = transactionType === 'income'
                  const isExpense = transactionType === 'expense'

                  return (
                    <TouchableOpacity
                      key={transaction.id}
                      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <View className={`w-12 h-12 rounded-full items-center justify-center ${getTransactionBg(transaction.type)}`}>
                            <Ionicons
                              name={getTransactionIcon(transaction.type)}
                              size={22}
                              color={transaction.type === 'SAVINGS' ? '#059669' : '#DC2626'}
                            />
                          </View>
                          <View className="ml-3 flex-1">
                            <Text className="text-gray-900 font-bold">
                              {transaction.note || 'No description'}
                            </Text>
                            <View className="flex-row items-center mt-0.5 flex-wrap">
                              <Text className="text-gray-400 text-xs">
                                {formatLocalizedDate(transaction.created_at)}
                              </Text>
                              <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                              <Text className="text-gray-400 text-xs">
                                {formatTime(transaction.created_at)}
                              </Text>
                              <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                              <Text className={`text-xs font-medium ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                                {getTransactionLabel(transaction)}
                              </Text>
                              {transaction.from_account_id && transaction.to_account_id && (
                                <>
                                  <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                                  <Text className="text-gray-400 text-xs">
                                    {getAccountName(transaction.from_account_id)} → {getAccountName(transaction.to_account_id)}
                                  </Text>
                                </>
                              )}
                            </View>
                          </View>
                        </View>
                        <Text className={`font-bold ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isIncome ? '+' : '-'}
                          {formatCurrency(transaction.amount, account.currency)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          />
        )}
      </View>
    </View>
  )
}

export default AccountDetail
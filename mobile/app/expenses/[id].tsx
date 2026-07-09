// app/expense/[id].tsx
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

import useAccounts from '../../hooks/useAccounts'
import useTransactions from '../../hooks/useTransactions'
import LoadingComponent from '../../components/LoadingComponent'

interface Account {
  id: string;
  name: string;
  type: string;
  currency: string;
  current_balance: string;
  target_amount: string;
  is_achived: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  userid: string;
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

const ExpenseDetail = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { accounts, isLoading: isAccountsLoading } = useAccounts()
  const { transactions, isLoading: isTransactionsLoading } = useTransactions()
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([])

  // Find the expense account
  const expenseAccount = accounts?.find((acc: Account) => acc.id === id)

  // Filter transactions for this expense account
  useEffect(() => {
    if (transactions && id) {
      const filtered = transactions.filter(
        (t: Transaction) => t.from_account_id === id || t.to_account_id === id
      )
      setExpenseTransactions(filtered)
    }
  }, [transactions, id])

  // Calculate total spent from this account
  const totalSpent = expenseTransactions.reduce((sum, t) => {
    if (t.from_account_id === id) {
      return sum + Number(t.amount)
    }
    return sum
  }, 0)

  // Calculate total received by this account
  const totalReceived = expenseTransactions.reduce((sum, t) => {
    if (t.to_account_id === id) {
      return sum + Number(t.amount)
    }
    return sum
  }, 0)

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

    return Object.keys(grouped)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map(year => ({
        year,
        transactions: grouped[year].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }))
  }

  const groupedTransactions = groupTransactionsByYear(expenseTransactions)

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(Number(amount))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  const getTransactionType = (transaction: Transaction) => {
    if (transaction.from_account_id === id) {
      return 'expense' // Money left this expense account
    } else if (transaction.to_account_id === id) {
      return 'income' // Money came to this expense account
    }
    return 'unknown'
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return 'arrow-down-circle'
      case 'expense':
        return 'arrow-up-circle'
      default:
        return 'cash-outline'
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-emerald-600'
      case 'expense':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTransactionBg = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-emerald-50'
      case 'expense':
        return 'bg-red-50'
      default:
        return 'bg-gray-50'
    }
  }

  const getAccountName = (accountId: string | null) => {
    if (!accountId) return 'External'
    const acc = accounts?.find((a: Account) => a.id === accountId)
    return acc?.name || 'Unknown Account'
  }

  const getCategoryEmoji = (accountName: string) => {
    const name = accountName.toUpperCase()
    if (name.includes('DAILY') || name.includes('FOOD')) return '🍽️'
    if (name.includes('ENTERTAIN')) return '🎬'
    if (name.includes('HOUSE') || name.includes('RENT') || name.includes('MORTGAGE')) return '🏠'
    if (name.includes('UTILITY') || name.includes('ELECTRIC') || name.includes('WATER')) return '💡'
    if (name.includes('TRANSPORT') || name.includes('CAR') || name.includes('FUEL')) return '🚗'
    if (name.includes('HEALTH') || name.includes('MEDICAL') || name.includes('DOCTOR')) return '🏥'
    if (name.includes('EDUCAT') || name.includes('SCHOOL') || name.includes('TUITION')) return '📚'
    if (name.includes('INSURANCE')) return '🛡️'
    if (name.includes('DEBT') || name.includes('LOAN') || name.includes('CREDIT')) return '💳'
    if (name.includes('SUBSCRIPTION') || name.includes('NETFLIX') || name.includes('SPOTIFY')) return '📱'
    return '💸'
  }

  const getCategoryColor = (accountName: string) => {
    const name = accountName.toUpperCase()
    if (name.includes('DAILY') || name.includes('FOOD')) return '#FF6B6B'
    if (name.includes('ENTERTAIN')) return '#4ECDC4'
    if (name.includes('HOUSE') || name.includes('RENT')) return '#FFA07A'
    if (name.includes('UTILITY')) return '#FFD93D'
    if (name.includes('TRANSPORT')) return '#6C5CE7'
    if (name.includes('HEALTH')) return '#FF6B6B'
    if (name.includes('EDUCAT')) return '#74B9FF'
    if (name.includes('INSURANCE')) return '#A8E6CF'
    if (name.includes('DEBT')) return '#FF8A5C'
    if (name.includes('SUBSCRIPTION')) return '#A29BFE'
    return '#DC2626'
  }

  if (isAccountsLoading) {
    return <LoadingComponent />
  }

  if (!expenseAccount) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={60} color="#9ca3af" />
        <Text className="text-gray-900 text-lg font-bold mt-4">Expense not found</Text>
        <Text className="text-gray-500 text-sm mt-1">The expense account you're looking for doesn't exist</Text>
        <TouchableOpacity
          className="mt-6 bg-red-600 rounded-2xl px-8 py-3"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const totalTransactions = expenseTransactions.length
  const hasTransactions = totalTransactions > 0
  const currentBalance = Number(expenseAccount.current_balance) || 0

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Red Gradient for Expenses */}
      <LinearGradient
        colors={["#DC2626", "#B91C1C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="px-4 pt-12 pb-6"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Text className="text-white text-lg font-bold mr-2" numberOfLines={1}>
              {expenseAccount.name}
            </Text>
            <View className="bg-white/20 px-2 py-0.5 rounded-full">
              <Text className="text-white text-xs font-medium">
                {expenseAccount.type}
              </Text>
            </View>
          </View>

          <View className="w-10" />
        </View>

        {/* Account Balance and Stats */}
        <View className="mt-4">
          <View className="bg-white/20 rounded-2xl p-4">
            <Text className="text-white/80 text-sm">Current Balance</Text>
            <Text className="text-white text-3xl font-bold mt-1">
              {formatCurrency(expenseAccount.current_balance, expenseAccount.currency)}
            </Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row mt-3 space-x-2">
            <View className="flex-1 bg-white/20 rounded-2xl p-3">
              <Text className="text-white/60 text-xs">Total Spent</Text>
              <Text className="text-white font-bold text-base">
                {formatCurrency(totalSpent.toString(), expenseAccount.currency)}
              </Text>
            </View>
            <View className="flex-1 bg-white/20 rounded-2xl p-3">
              <Text className="text-white/60 text-xs">Total Received</Text>
              <Text className="text-white font-bold text-base">
                {formatCurrency(totalReceived.toString(), expenseAccount.currency)}
              </Text>
            </View>
            <View className="flex-1 bg-white/20 rounded-2xl p-3">
              <Text className="text-white/60 text-xs">Transactions</Text>
              <Text className="text-white font-bold text-base">
                {totalTransactions}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Transactions List */}
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Text className="text-gray-900 text-lg font-bold">
              Transactions
            </Text>
            {expenseAccount.type && (
              <View className="ml-2 bg-red-100 px-2 py-0.5 rounded-full">
                <Text className="text-red-600 text-xs font-medium">
                  {expenseAccount.type}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-gray-500 text-sm">
            {totalTransactions} total
          </Text>
        </View>

        {isTransactionsLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#DC2626" />
            <Text className="text-gray-500 mt-3 text-sm">Loading transactions...</Text>
          </View>
        ) : !hasTransactions ? (
          <View className="flex-1 items-center justify-center">
            <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="receipt-outline" size={40} color="#DC2626" />
            </View>
            <Text className="text-gray-900 text-lg font-bold mt-4">No transactions</Text>
            <Text className="text-gray-500 text-sm mt-1 text-center px-6">
              This expense account doesn't have any transactions yet
            </Text>
            <TouchableOpacity
              className="mt-6 bg-red-600 rounded-2xl px-6 py-3"
              onPress={() => router.push("/transactions")}
            >
              <Text className="text-white font-bold">Add Transaction</Text>
            </TouchableOpacity>
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
                  <View className="bg-red-100 px-4 py-2 rounded-full">
                    <Text className="text-red-700 font-bold text-base">
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
                  const categoryEmoji = getCategoryEmoji(expenseAccount.name)
                  const categoryColor = getCategoryColor(expenseAccount.name)
                  
                  return (
                    <TouchableOpacity
                      key={transaction.id}
                      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <View className={`w-12 h-12 rounded-full items-center justify-center ${getTransactionBg(transactionType)}`}>
                            <Text className="text-xl">{categoryEmoji}</Text>
                          </View>
                          <View className="ml-3 flex-1">
                            <Text className="text-gray-900 font-bold">
                              {transaction.note || 'No description'}
                            </Text>
                            <View className="flex-row items-center mt-0.5 flex-wrap">
                              <Text className="text-gray-400 text-xs">
                                {formatDate(transaction.created_at)}
                              </Text>
                              <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                              <Text className="text-gray-400 text-xs">
                                {formatTime(transaction.created_at)}
                              </Text>
                              <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                              <Text className={`text-xs font-medium ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                                {isIncome ? 'Received' : 'Sent'}
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
                          {formatCurrency(transaction.amount, expenseAccount.currency)}
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

export default ExpenseDetail
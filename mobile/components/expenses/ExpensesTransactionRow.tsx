import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction, Account } from '../../types';

import i18n from '../../lib/i18n';
import { formatLocalizedDate, getCategoryIconAndColor } from '@/constants/expensesHelpers';
import { formatCurrency } from '@/constants/currency';

interface RowProps {
  transaction: Transaction;
  currentAccountId: string;
  accountCurrency: string;
  accountName: string;
  allAccounts: Account[] | undefined;
}

export const ExpenseTransactionRow: React.FC<RowProps> = ({
  transaction,
  currentAccountId,
  accountCurrency,
  accountName,
  allAccounts,
}) => {
  const isIncome = transaction.to_account_id === currentAccountId;
  const design = getCategoryIconAndColor(accountName);

  const getTargetAccountLabel = () => {
    const targetId = isIncome ? transaction.from_account_id : transaction.to_account_id;

    if (!targetId) return i18n.t("transactions.external") || 'External';

    const targetAccount = allAccounts?.find(a => a.id === targetId);
    if (!targetAccount) return i18n.t("transactions.other_account") || 'Other Account';
    const accountType = targetAccount.type.toLowerCase(); 
    const accountName = targetAccount.name;               
    const translationKey = `${accountType}.${accountName}`;
    const localizedName = i18n.t(translationKey);

    return localizedName.startsWith('[missing') ? accountName : localizedName;
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm flex-row items-center justify-between"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1 mr-2">
        {/* Ionicons Container Block replacing native text emojis */}
        <View className={`w-12 h-12 rounded-full items-center justify-center ${design.bg}`}>
          <Ionicons name={design.icon} size={22} color={design.color} />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-gray-900 font-bold text-sm" numberOfLines={1}>
            {transaction.note || 'No description'}
          </Text>

          <View className="flex-row items-center mt-1 flex-wrap">
            <Text className="text-gray-400 text-xs">
              {formatLocalizedDate(transaction.created_at)}
            </Text>
            <View className="w-1 h-1 rounded-full bg-gray-300 mx-1.5" />
            <Text className="text-gray-400 text-xs max-w-[120px]" numberOfLines={1}>
              {getTargetAccountLabel()}
            </Text>
            <View className="w-1 h-1 rounded-full bg-gray-300 mx-1.5" />
            <Text className={`text-[11px] font-bold ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
              {isIncome ? 'Received' : 'Sent'}
            </Text>
          </View>
        </View>
      </View>

      <Text className={`font-bold text-sm ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount, accountCurrency)}
      </Text>
    </TouchableOpacity>
  );
};
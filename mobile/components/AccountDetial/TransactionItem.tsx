import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Account, Transaction } from '@/types';
import { formatCurrency } from '@/constants/currency';
import { formatLocalizedDate } from '@/constants/expensesHelpers';
import i18n from '@/lib/i18n';
import { formatTime, getAccountName, getTransactionBg, getTransactionIcon, getTransactionLabel, getTransactionType } from '@/constants/utlis';


type Props = {
    transaction: Transaction;
    accountId: string;
    accountCurrency: string;
    accounts?: Account[];
};

export default function TransactionItem({ transaction, accountId, accountCurrency, accounts }: Props) {
    const transactionType = getTransactionType(transaction, accountId);
    const isIncome = transactionType === 'income';

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
            activeOpacity={0.7}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <View
                        className={`w-12 h-12 rounded-full items-center justify-center ${getTransactionBg(
                            transaction.type
                        )}`}
                    >
                        <Ionicons
                            name={getTransactionIcon(transaction.type) as any}
                            size={22}
                            color={transaction.type === 'SAVINGS' ? '#059669' : '#DC2626'}
                        />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="text-gray-900 font-bold">
                            {transaction.note || i18n.t('accountDetail.transaction.noDescription')}
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
                            <Text
                                className={`text-xs font-medium ${isIncome ? 'text-emerald-600' : 'text-red-600'
                                    }`}
                            >
                                {getTransactionLabel(transaction, accountId)}
                            </Text>
                            {transaction.from_account_id && transaction.to_account_id && (
                                <>
                                    <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                                    <Text className="text-gray-400 text-xs flex-shrink">
                                        {getAccountName(transaction.from_account_id, accounts)} →{' '}
                                        {getAccountName(transaction.to_account_id, accounts)}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>
                <Text className={`font-bold ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'}
                    {formatCurrency(transaction.amount, accountCurrency)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
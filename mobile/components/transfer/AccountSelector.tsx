// app/transactions/components/AccountSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccountSelectorProps } from '@/types';
import i18n from '@/lib/i18n';
import { formatCurrency } from '@/constants/currency';

export default function AccountSelector({
    label,
    account,
    onPress,
    iconName,
    iconColor,
    iconBgClass,
}: AccountSelectorProps) {
    return (
        <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">
                {label}
            </Text>
            <TouchableOpacity
                className="bg-white rounded-2xl border border-gray-200 px-4 py-4 flex-row items-center justify-between"
                onPress={onPress}
            >
                <View className="flex-row items-center">
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${iconBgClass}`}>
                        <Ionicons
                            name={iconName}
                            size={22}
                            color={iconColor}
                        />
                    </View>
                    <View>
                        <Text className="text-gray-900 font-bold">
                            {account
                                ? account.type === "SAVINGS"
                                    ? i18n.t(`savings.${account.name}`)
                                    : account.type === "EXPENSES"
                                        ? i18n.t(`expenses.${account.name}`)
                                        : account.name
                                : i18n.t("transaction.SELECT_ACCOUNT")}
                        </Text>
                        {account && (
                            <Text className="text-gray-500 text-xs">
                                {formatCurrency(account.current_balance, account.currency)}
                            </Text>
                        )}
                    </View>
                </View>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </TouchableOpacity>
        </View>
    );
}
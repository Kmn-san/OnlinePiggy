import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModeToggleProps } from '@/types';
import i18n from '@/lib/i18n';

export default function ModeToggle({ isIncome, onToggle }: ModeToggleProps) {
    return (
        <View className="flex-row items-center justify-between bg-white rounded-2xl p-4 border border-gray-200 mb-6">
            <View className="flex-row items-center">
                <Ionicons
                    name={isIncome ? "cash-outline" : "swap-horizontal-outline"}
                    size={22}
                    color={isIncome ? "#059669" : "#6b7280"}
                />
                <Text className="text-gray-700 font-semibold ml-3">
                    {i18n.t(`transaction.${isIncome ? 'INCOME_MODE' : 'TRANSFER_MODE'}`)}
                </Text>
            </View>
            <TouchableOpacity
                className={`px-4 py-2 rounded-full ${isIncome ? 'bg-emerald-100' : 'bg-gray-100'}`}
                onPress={() => onToggle(!isIncome)}
            >
                <Text className={`font-bold ${isIncome ? 'text-emerald-700' : 'text-gray-600'}`}>
                    {i18n.t(`transaction.${isIncome ? 'SWITCH_TO_TRANSFER' : 'SWITCH_TO_INCOME'}`)}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
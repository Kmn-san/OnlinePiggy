import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Account } from '../../types';
import { formatCurrency } from '@/constants/currency';
import i18n from '@/lib/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
    account: Account;
    onBack: () => void;
}

export const ExpenseDetailHeader: React.FC<HeaderProps> = ({
    account,
    onBack,
}) => {
    const insets = useSafeAreaInsets();
    return (
        <LinearGradient
            colors={["#DC2626", "#B91C1C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-4 pb-6"
            style={{ paddingTop: insets.top + 16 }}
        >
            <View className="flex-row items-center justify-between">
                <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                    onPress={onBack}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <View className="flex-row items-center">
                    <Text className="text-white text-lg font-bold mr-2" numberOfLines={1}>
                        {i18n.t(`expenses.${account.name}`)}
                    </Text>
                    <View className="bg-white/20 px-2 py-0.5 rounded-full">
                        <Text className="text-white text-xs font-medium"> {i18n.t(`expenses.${account.type}`)}</Text>
                    </View>
                </View>
                <View className="w-10" />
            </View>

            <View className="mt-4">
                <View className="bg-white/20 rounded-2xl p-4">
                    <Text className="text-white/80 text-sm">{i18n.t(`expenses.CURRENT_BALANCE`)}</Text>
                    <Text className="text-white text-3xl font-bold mt-1">
                        {formatCurrency(account.current_balance, account.currency)}
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
};
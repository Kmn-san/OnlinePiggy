import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/lib/i18n';
import { formatCurrency } from '@/constants/currency';
import { Account } from '@/types';

type Props = {
    account: Account;
    onBack: () => void;
    topInset: number;
};

export default function AccountHeader({ account, onBack, topInset }: Props) {
    return (
        <LinearGradient
            colors={['#059669', '#047857']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-4 pb-6"
            style={{ paddingTop: topInset + 16 }}
        >
            <View className="flex-row items-center justify-between ml-4">
                <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                    onPress={onBack}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Text className="text-white text-lg font-bold" numberOfLines={1}>
                    {i18n.t(`savings.${account.name}`, { defaultValue: account.name })}
                </Text>

                <View className="w-10" />
            </View>

            <View className="mt-4 bg-white/20 rounded-2xl p-4">
                <Text className="text-white/80 text-sm">
                    {i18n.t('accountDetail.header.currentBalance')}
                </Text>
                <Text className="text-white text-3xl font-bold mt-1">
                    {formatCurrency(account.current_balance.toString(), account.currency)}
                </Text>
                <View className="flex-row items-center mt-2">
                    <View className="bg-white/20 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-semibold">{account.type}</Text>
                    </View>
                    {account.type === 'GOAL' && account.target_amount && (
                        <View className="bg-white/20 px-3 py-1 rounded-full ml-2">
                            <Text className="text-white text-xs font-semibold">
                                {i18n.t('accountDetail.header.target')} {formatCurrency(account.target_amount.toString(), account.currency)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </LinearGradient>
    );
}
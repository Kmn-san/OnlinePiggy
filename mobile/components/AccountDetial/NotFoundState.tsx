import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/lib/i18n';

type Props = {
    onBack: () => void;
};

export default function NotFoundState({ onBack }: Props) {
    return (
        <View className="flex-1 bg-gray-50 items-center justify-center px-6">
            <Ionicons name="alert-circle-outline" size={60} color="#9ca3af" />
            <Text className="text-gray-900 text-lg font-bold mt-4">
                {i18n.t('accountDetail.notFound.title')}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
                {i18n.t('accountDetail.notFound.subtitle')}
            </Text>
            <TouchableOpacity
                className="mt-6 bg-emerald-600 rounded-2xl px-8 py-3"
                onPress={onBack}
            >
                <Text className="text-white font-bold">
                    {i18n.t('accountDetail.notFound.backButton')}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
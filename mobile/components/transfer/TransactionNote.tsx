import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TransactionNoteProps } from '@/types';
import i18n from '@/lib/i18n';

export default function TransactionNote({
    value,
    onChangeText,
    maxLength = 100,
}: TransactionNoteProps) {
    return (
        <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">
                {i18n.t("transaction.DESCRIPTION")}
            </Text>
            <View className="bg-white rounded-2xl border border-gray-200 px-4 py-2 flex-row items-center">
                <Ionicons name="document-text-outline" size={20} color="#9ca3af" />
                <TextInput
                    className="flex-1 ml-3 text-gray-900 text-base py-3"
                    placeholder="Add a note..."
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChangeText}
                    maxLength={maxLength}
                    returnKeyType="done"
                    blurOnSubmit={true}
                />
                {value.length > 0 && (
                    <Text className="text-gray-400 text-xs">
                        {value.length}/{maxLength}
                    </Text>
                )}
            </View>
        </View>
    );
}
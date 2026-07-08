import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccountModalProps } from '@/types';

export default function AccountModal({
    visible,
    title,
    accounts,
    selectedAccountId,
    isIncome,
    onClose,
    onSelect,
}: AccountModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl px-6 pt-6 pb-8 max-h-[70%]">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold text-gray-900">{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={accounts}
                        keyExtractor={(item) => item.id?.toString()}
                        renderItem={({ item }) => {
                            const isSelected = selectedAccountId === item.id;
                            const isSavings = item.type === 'SAVINGS';
                            return (
                                <TouchableOpacity
                                    className="flex-row items-center py-4 border-b border-gray-100"
                                    onPress={() => onSelect(item)}
                                >
                                    <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${isSavings ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                        <Ionicons
                                            name={isIncome ? 'add-circle' : 'arrow-up-circle'}
                                            size={22}
                                            color={isSavings ? '#059669' : '#DC2626'}
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <View className="flex-row items-center">
                                            <Text className="text-gray-900 font-bold">{item.name}</Text>
                                            <View className={`ml-2 px-2 py-0.5 rounded-full ${isSavings ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                                <Text className={`text-xs font-medium ${isSavings ? 'text-emerald-700' : 'text-red-700'}`}>
                                                    {item.type}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text className="text-gray-500 text-sm">
                                            {item.currency} {item.current_balance?.toLocaleString() || '0'}
                                        </Text>
                                    </View>
                                    {isSelected && <Ionicons name="checkmark-circle" size={24} color="#059669" />}
                                </TouchableOpacity>
                            );
                        }}
                        ListEmptyComponent={() => (
                            <View className="items-center py-8">
                                <Text className="text-gray-500">No accounts found</Text>
                            </View>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
}
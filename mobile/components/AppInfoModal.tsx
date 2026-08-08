import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppInfoModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function AppInfoModal({ visible, onClose }: AppInfoModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center p-4">
                <View className="bg-white w-full max-w-lg rounded-2xl p-6 max-h-[85%] shadow-xl">
                    
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-3">
                        <View className="flex-row items-center">
                            <Ionicons name="shield-checkmark-outline" size={24} color="#059669" />
                            <Text className="text-lg font-bold text-gray-800 ml-2">App Data & Services</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-1">
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView showsVerticalScrollIndicator={false} className="space-y-4">
                        
                        {/* Data Collected */}
                        <View className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-3">
                            <Text className="font-bold text-emerald-900 mb-1">👤 Data We Collect</Text>
                            <Text className="text-emerald-800 text-sm leading-5">
                                • Google Name & Profile Picture{'\n'}
                                • Account & Transaction Financial Records{'\n'}
                                • Currency Preferences
                            </Text>
                        </View>

                        {/* Tech Stack Breakdown */}
                        <Text className="font-bold text-gray-700 text-base mb-2">⚡ Powered By</Text>

                        {/* Clerk */}
                        <View className="flex-row items-start mb-3 bg-gray-50 p-3 rounded-xl">
                            <Ionicons name="key-outline" size={20} color="#4F46E5" className="mt-0.5" />
                            <View className="ml-3 flex-1">
                                <Text className="font-semibold text-gray-800">Authentication (Clerk)</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Handles secure login, logout, registration, and user sessions.</Text>
                            </View>
                        </View>

                        {/* Neon Postgres */}
                        <View className="flex-row items-start mb-3 bg-gray-50 p-3 rounded-xl">
                            <Ionicons name="server-outline" size={20} color="#0284C7" className="mt-0.5" />
                            <View className="ml-3 flex-1">
                                <Text className="font-semibold text-gray-800">Database (Neon Postgres)</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Stores user accounts, balances, and transaction logs securely on the cloud.</Text>
                            </View>
                        </View>

                        {/* RapidAPI Currency */}
                        <View className="flex-row items-start mb-3 bg-gray-50 p-3 rounded-xl">
                            <Ionicons name="cash" size={20} color="#D97706" className="mt-0.5" />
                            <View className="ml-3 flex-1">
                                <Text className="font-semibold text-gray-800">Money Exchange (RapidAPI)</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Powered by exchange-rates7.p.rapidapi.com for accurate live currency rates.</Text>
                            </View>
                        </View>

                        {/* AI / DeepSeek */}
                        <View className="flex-row items-start mb-4 bg-gray-50 p-3 rounded-xl">
                            <Ionicons name="sparkles-outline" size={20} color="#9333EA" className="mt-0.5" />
                            <View className="ml-3 flex-1">
                                <Text className="font-semibold text-gray-800">AI Assistant (DeepSeek via OpenRouter)</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Processes chat prompts via https://openrouter.ai/api/v1/chat/completions to provide financial insights.</Text>
                            </View>
                        </View>

                    </ScrollView>

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-emerald-600 py-3 rounded-xl mt-4 items-center"
                    >
                        <Text className="text-white font-semibold">Got it</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}
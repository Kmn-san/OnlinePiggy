import React from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "@/lib/i18n";

interface AppInfoModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function AppInfoModal({
    visible,
    onClose,
}: AppInfoModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center px-5">
                <View className="bg-white rounded-3xl p-5 max-h-[85%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-3">
                        <View className="flex-row items-center flex-1">
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={24}
                                color="#059669"
                            />

                            <Text className="text-lg font-bold text-gray-800 ml-2">
                                {i18n.t("appInfo.title")}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={onClose}
                            className="p-1"
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 4,
                        }}
                    >
                        {/* Data Collected */}
                        <View className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-5">
                            <View className="flex-row items-center mb-3">
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color="#047857"
                                />

                                <Text className="font-bold text-emerald-900 ml-2">
                                    {i18n.t("appInfo.dataCollected")}
                                </Text>
                            </View>

                            <View className="flex-row items-start mb-2">
                                <Ionicons
                                    name="logo-google"
                                    size={18}
                                    color="#047857"
                                    className="mt-0.5"
                                />

                                <Text className="text-emerald-800 text-sm leading-5 ml-2 flex-1">
                                    {i18n.t("appInfo.googleProfile")}
                                </Text>
                            </View>

                            <View className="flex-row items-start mb-2">
                                <Ionicons
                                    name="wallet-outline"
                                    size={18}
                                    color="#047857"
                                    className="mt-0.5"
                                />

                                <Text className="text-emerald-800 text-sm leading-5 ml-2 flex-1">
                                    {i18n.t("appInfo.financialRecords")}
                                </Text>
                            </View>

                            <View className="flex-row items-start">
                                <Ionicons
                                    name="cash-outline"
                                    size={18}
                                    color="#047857"
                                    className="mt-0.5"
                                />

                                <Text className="text-emerald-800 text-sm leading-5 ml-2 flex-1">
                                    {i18n.t("appInfo.currencyPreferences")}
                                </Text>
                            </View>
                        </View>

                        {/* Powered By */}
                        <View className="flex-row items-center mb-3">
                            <Ionicons
                                name="flash-outline"
                                size={20}
                                color="#4B5563"
                            />

                            <Text className="font-bold text-gray-700 text-base ml-2">
                                {i18n.t("appInfo.poweredBy")}
                            </Text>
                        </View>

                        {/* Clerk */}
                        <View className="flex-row items-start mb-3 bg-gray-50 p-3 rounded-xl">
                            <View className="w-9 h-9 rounded-full bg-indigo-100 items-center justify-center">
                                <Ionicons
                                    name="key-outline"
                                    size={20}
                                    color="#4F46E5"
                                />
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="font-semibold text-gray-800">
                                    {i18n.t("appInfo.authentication")}
                                </Text>

                                <Text className="text-gray-500 text-xs mt-1 leading-4">
                                    {i18n.t(
                                        "appInfo.authenticationDescription"
                                    )}
                                </Text>
                            </View>
                        </View>

                        {/* Neon Postgres */}
                        <View className="flex-row items-start mb-3 bg-gray-50 p-3 rounded-xl">
                            <View className="w-9 h-9 rounded-full bg-sky-100 items-center justify-center">
                                <Ionicons
                                    name="server-outline"
                                    size={20}
                                    color="#0284C7"
                                />
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="font-semibold text-gray-800">
                                    {i18n.t("appInfo.database")}
                                </Text>

                                <Text className="text-gray-500 text-xs mt-1 leading-4">
                                    {i18n.t(
                                        "appInfo.databaseDescription"
                                    )}
                                </Text>
                            </View>
                        </View>

                        {/* RapidAPI Currency */}
                        <View className="flex-row items-start mb-3 bg-gray-50 p-3 rounded-xl">
                            <View className="w-9 h-9 rounded-full bg-amber-100 items-center justify-center">
                                <Ionicons
                                    name="cash-outline"
                                    size={20}
                                    color="#D97706"
                                />
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="font-semibold text-gray-800">
                                    {i18n.t("appInfo.moneyExchange")}
                                </Text>

                                <Text className="text-gray-500 text-xs mt-1 leading-4">
                                    {i18n.t(
                                        "appInfo.moneyExchangeDescription"
                                    )}
                                </Text>
                            </View>
                        </View>

                        {/* AI / DeepSeek */}
                        <View className="flex-row items-start mb-2 bg-gray-50 p-3 rounded-xl">
                            <View className="w-9 h-9 rounded-full bg-purple-100 items-center justify-center">
                                <Ionicons
                                    name="sparkles-outline"
                                    size={20}
                                    color="#9333EA"
                                />
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="font-semibold text-gray-800">
                                    {i18n.t("appInfo.aiAssistant")}
                                </Text>

                                <Text className="text-gray-500 text-xs mt-1 leading-4">
                                    {i18n.t(
                                        "appInfo.aiAssistantDescription"
                                    )}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-emerald-600 py-3.5 rounded-xl mt-4 items-center"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-semibold">
                            {i18n.t("appInfo.gotIt")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
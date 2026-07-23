// app/expenses/create-goal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useCurrentUser from '@/hooks/useCurrentUser';
import { formatCurrency } from '@/constants/currency';
import i18n from '@/lib/i18n';
import useAccount from '@/hooks/useAccounts';
import GradientHeader from '@/components/GradientHeader';

export default function CreateGoal() {
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const { user, isLoading } = useCurrentUser()
  const { createGoal } = useAccount()

  const handleDone = async () => {
    // Validate inputs
    if (!goalTitle.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }
    if (!targetAmount.trim() || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }
    try {
      await createGoal.mutateAsync({
        goalName: goalTitle.trim(),
        targetAmount: targetAmount.trim()
      })
      router.back();
    } catch (error: any) {
      console.error("Failed to create savings goal account:", error);

      const backendCode = error.response?.data?.code;

      Alert.alert(
        i18n.t("common.error"),
        backendCode ? i18n.t(`errorDetail.${backendCode}`) : i18n.t("errorDetail.UNKNOWN_ERROR")
      );
    }
  };

  const handleCancel = () => {
    Alert.alert(
      i18n.t("createAccount.CANCEL_CREATE"),
      i18n.t("common.cancelInfo"),
      [
        { text: i18n.t("common.continue"), style: 'cancel' },
        { text: i18n.t("common.cancel"), style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <GradientHeader
        colors={['#6D28D9', '#4F46E5']}
        title={i18n.t("createAccount.createNewGoal")}
        onBackPress={handleCancel}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          className="flex-1 px-6 pt-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Goal Icon */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-full bg-emerald-50 items-center justify-center border-2 border-emerald-200">
              <Ionicons name="flag-outline" size={36} color="#059669" />
            </View>
          </View>

          {/* Goal Title Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">
              {i18n.t("createAccount.goalTitle")}
            </Text>
            <View className="bg-white rounded-2xl border border-gray-200 px-4 py-2 flex-row items-center">
              <Ionicons name="create-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base py-3"
                placeholder="e.g., New Car, Vacation, House"
                placeholderTextColor="#9ca3af"
                value={goalTitle}
                onChangeText={setGoalTitle}
                maxLength={50}
              />
              {goalTitle.length > 0 && (
                <Text className="text-gray-400 text-xs">
                  {goalTitle.length}/50
                </Text>
              )}
            </View>
          </View>

          {/* Target Amount Input */}
          <View className="mb-8">
            <Text className="text-gray-700 font-semibold mb-2">
              {i18n.t("createAccount.targetAmount")}
            </Text>
            <View className="bg-white rounded-2xl border border-gray-200 px-4 py-2 flex-row items-center">
              <Ionicons name="cash-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base py-3"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                value={targetAmount}
                onChangeText={setTargetAmount}
                keyboardType="decimal-pad"
              />
              <Text className="text-gray-400 font-semibold">{user?.currency}</Text>
            </View>
          </View>

          {/* Goal Preview */}
          {(goalTitle || targetAmount) && (
            <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-8">
              <Text className="text-gray-500 text-sm mb-2">
                {i18n.t("createAccount.goalPreview")}
              </Text>
              <Text className="text-gray-900 font-bold text-lg">
                {goalTitle || 'Untitled Goal'}
              </Text>
              {targetAmount && (
                <Text className="text-emerald-600 font-bold text-xl mt-1">
                  {formatCurrency(targetAmount, user?.currency!)}
                </Text>
              )}
            </View>
          )}

          {/* Bottom Spacing */}
          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Buttons */}
      <View className="px-6 pb-8 pt-4 bg-white border-t border-gray-200">
        <View className="flex-row space-x-4">
          <TouchableOpacity
            className="flex-1 bg-gray-100 rounded-2xl py-4"
            onPress={handleCancel}
          >
            <Text className="text-gray-700 font-bold text-center">
              {i18n.t("common.cancel")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-emerald-600 rounded-2xl py-4 shadow-lg shadow-emerald-600/30"
            onPress={handleDone}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold text-center">
                {i18n.t("common.done")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
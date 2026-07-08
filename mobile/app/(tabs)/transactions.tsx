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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import useAccounts from '../../hooks/useAccounts';
import LoadingComponent from '../../components/LoadingComponent';
import ModeToggle from '../../components/transfer/ModeToggle';
import AccountModal from '../../components/transfer/AccountModal';
import AccountSelector from '../../components/transfer/AccountSelector';
import TransactionNote from '../../components/transfer/TransactionNote';

export default function Transactions() {
  const router = useRouter();
  const { accounts, isLoading } = useAccounts();

  const [fromAccount, setFromAccount] = useState<any>(null); // For Transfers
  const [toAccount, setToAccount] = useState<any>(null);     // For Transfers AND Income
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [isIncome, setIsIncome] = useState(false);

  const savingsAccounts = accounts?.filter((acc: any) => acc.type === 'SAVINGS') || [];
  const expenseAccounts = accounts?.filter((acc: any) => acc.type !== 'SAVINGS' && acc.type !== 'GOAL') || [];
  const allAccounts = [...savingsAccounts, ...expenseAccounts];

  const handleSubmit = () => {
    // 1. Validation Logic based on Mode
    if (isIncome) {
      if (!toAccount) {
        Alert.alert('Error', 'Please select an account to receive the income');
        return;
      }
    } else {
      if (!fromAccount) {
        Alert.alert('Error', 'Please select a source account');
        return;
      }
      if (!toAccount) {
        Alert.alert('Error', 'Please select a destination account');
        return;
      }
      if (fromAccount.id === toAccount.id) {
        Alert.alert('Error', 'Source and destination accounts must be different');
        return;
      }
      if (Number(amount) > fromAccount.current_balance) {
        Alert.alert('Error', 'Insufficient balance in source account');
        return;
      }
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // 2. Payload Construction aligned with your database plan 
    const transactionPayload = {
      type: isIncome ? 'INCOME' : 'TRANSFER',
      amount: Number(amount),
      description: description.trim() || null,
      sourceAccountId: isIncome ? null : fromAccount.id,
      destinationAccountId: toAccount.id, // Lands here for both modes!
      timestamp: new Date().toISOString(),
    };

    console.log('🚀 Sending Transaction Data:', JSON.stringify(transactionPayload, null, 2));

    // // Simulate API Handling
    // setIsSubmitting(true);
    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   router.back();
    // }, 1000);
  };

  const handleCancel = () => {
    Alert.alert('Cancel Transaction', 'Are you sure you want to cancel?', [
      { text: 'Continue Editing', style: 'cancel' },
      { text: 'Cancel', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient colors={["#059669", "#047857"]} className="px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-lg font-bold">New Transaction</Text>
          <View className="w-10" />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Mode Switcher */}
          <ModeToggle
            isIncome={isIncome}
            onToggle={(value) => {
              setIsIncome(value);
              setFromAccount(null); // Clear form state to maintain pristine validations
              setToAccount(null);
            }}
          />

          {/* Source Account Selector (Only visible for Transfers) */}
          {!isIncome && (
            <AccountSelector
              label='From Account'
              account={fromAccount}
              onPress={() => setShowFromModal(true)}
              iconName='arrow-up-circle'
              iconColor="#059669"
              iconBgClass="bg-emerald-50"
            />
          )}

          {/* Destination Account Selector (Always visible, changes styles dynamically) */}
          <AccountSelector
            label={isIncome ? 'Select Account to Add Income' : "To Account"}
            account={toAccount}
            onPress={() => setShowToModal(true)}
            iconName={isIncome ? 'add-circle' : "arrow-down-circle"}
            iconColor={isIncome ? "#059669" : "#DC2626"}
            iconBgClass={isIncome ? "bg-emerald-50" : "bg-red-50"} // Emerald tint looks great for incoming money
          />

          {/* Inputs */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Amount</Text>
            <View className="bg-white rounded-2xl border border-gray-200 px-4 py-2 flex-row items-center">
              <Ionicons name="cash-outline" size={20} color="#9ca3af" />
              <TextInput className="flex-1 ml-3 text-gray-900 text-2xl font-bold py-3" placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
              <Text className="text-gray-400 font-semibold">USD</Text>
            </View>
          </View>

          <TransactionNote
            value={description}
            onChangeText={setDescription}
            maxLength={100}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Persistent Bottom Action Bar */}
      <View className="px-6 pb-8 pt-4 bg-white border-t border-gray-200">
        <View className="flex-row space-x-4">
          <TouchableOpacity className="flex-1 bg-gray-100 rounded-2xl py-4" onPress={handleCancel}>
            <Text className="text-gray-700 font-bold text-center">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-emerald-600 rounded-2xl py-4 shadow-lg" onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white font-bold text-center">{isIncome ? 'Add Income' : 'Transfer'}</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals Tree */}
      <AccountModal
        visible={showFromModal}
        title="Select Source Account"
        accounts={allAccounts}
        selectedAccountId={fromAccount?.id}
        isIncome={isIncome}
        onClose={() => setShowFromModal(false)}
        onSelect={(acc) => { setFromAccount(acc); setShowFromModal(false); }}
      />

      <AccountModal
        visible={showToModal}
        title={isIncome ? "Select Target Account" : "Select Destination Account"}
        // Safe contextual filter logic 
        accounts={isIncome ? allAccounts : allAccounts.filter(acc => acc.id !== fromAccount?.id)}
        selectedAccountId={toAccount?.id}
        isIncome={isIncome}
        onClose={() => setShowToModal(false)}
        onSelect={(acc) => { setToAccount(acc); setShowToModal(false); }}
      />
    </View>
  );
}
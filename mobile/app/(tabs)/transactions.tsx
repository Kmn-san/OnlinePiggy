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
import useCurrentUser from '@/hooks/useCurrentUser';
import { EXPENSE_CATEGORIES } from '@/constants/expenseCategorires';
import i18n from '@/lib/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientHeader from '@/components/GradientHeader';
import useTransactions from '@/hooks/useTransactions';

export default function Transactions() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { accounts, isLoading } = useAccounts();
  const { user } = useCurrentUser();
  const [fromAccount, setFromAccount] = useState<any>(null); // For Transfers
  const [toAccount, setToAccount] = useState<any>(null);     // For Transfers AND Income
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const { createTransaction } = useTransactions();
  const BUILT_IN_EXPENSES = EXPENSE_CATEGORIES.map((category) => ({
    id: `builtin-${category.id}`,
    name: category.label,
    type: "EXPENSES",
    currency: user?.currency || "USD",
    current_balance: 0,
    isBuiltIn: true,
    icon: category.icon,
    color: category.color,
  }));
  const savingsAccounts =
    accounts?.filter((acc: any) => acc.type === "SAVINGS") || [];
  const isSavingsAccount = (account: any) =>
    account?.type === "SAVINGS" || account?.type === "GOAL";
  const goalAccounts =
    accounts?.filter((acc: any) => acc.type === "GOAL") || [];
  const databaseExpenseAccounts =
    accounts?.filter((acc: any) => acc.type === "EXPENSES") || [];

  const expenseAccounts = BUILT_IN_EXPENSES.map((builtIn) => {
    const existing = databaseExpenseAccounts.find(
      (dbAcc: any) =>
        dbAcc.name.trim().toLowerCase() ===
        builtIn.name.trim().toLowerCase()
    );

    return existing ?? builtIn;
  });

  const targetTransferAccounts = [
    ...savingsAccounts,
    ...goalAccounts,
    ...expenseAccounts,
  ];

  const handleSubmit = async () => {
    // 1. Validation Logic based on Mode
    if (isIncome) {
      if (!toAccount) {
        Alert.alert(
          i18n.t("common.error"),
          i18n.t("errorDetial.SELECT_INCOME_ACCOUNT")
        );
        return;
      }
    } else {
      if (!fromAccount) {
        Alert.alert(
          i18n.t("common.error"),
          i18n.t("errorDetial.SELECT_SOURCE_ACCOUNT")
        );
        return;
      }
      if (!toAccount) {
        Alert.alert(
          i18n.t("common.error"),
          i18n.t("errorDetial.SELECT_DESTINATION_ACCOUNT")
        );
        return;
      }
      if (fromAccount.id === toAccount.id) {
        Alert.alert(
          i18n.t("common.error"),
          i18n.t("errorDetial.SAME_ACCOUNT_ERROR")
        );
        return;
      }
      if (Number(amount) > fromAccount.current_balance) {
        Alert.alert(
          i18n.t("common.error"),
          i18n.t("errorDetial.INSUFFICIENT_BALANCE")
        );
        return;
      }
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert(
        i18n.t("common.error"),
        i18n.t("errorDetial.INVALID_AMOUNT")
      );
      return;
    }
    setIsSubmitting(true);

    try {
      await createTransaction.mutateAsync({
        fromAccId: isIncome ? null : fromAccount.id,
        toAccountName: toAccount.name,
        accountType: toAccount.type,
        amount: Number(amount),
        note: description.trim(),
      });

      Alert.alert(
        i18n.t("common.success"),
        i18n.t("transaction.TRANSACTION_CREATED")
      );

      router.back();
    } catch (error: any) {
      Alert.alert(
        i18n.t("common.error"),
        error?.response?.data?.message ??
        i18n.t("errorDetial.UNKNOWN_ERROR")
      );
    } finally {
      setIsSubmitting(false);
    }

  };

  const handleCancel = () => {
    Alert.alert(i18n.t("transaction.CANCEL_TRANSACTION"), i18n.t("common.cancelInfo"), [
      { text: i18n.t("common.continue"), style: 'cancel' },
      { text: i18n.t("common.cancel"), style: 'destructive', onPress: () => router.back() },
    ]);
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <View className="flex-1 bg-gray-50">

      <GradientHeader
        title={i18n.t("transaction.NEW_TRANSACTION")}
        showBackButton={false}
      />

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
              label={i18n.t("transaction.FROM_ACCOUNT")}
              account={fromAccount}
              onPress={() => setShowFromModal(true)}
              iconName='arrow-up-circle'
              iconColor={
                !fromAccount || isSavingsAccount(fromAccount)
                  ? "#059669"
                  : "#DC2626"
              }
              iconBgClass={
                !fromAccount || isSavingsAccount(fromAccount)
                  ? "bg-emerald-50"
                  : "bg-red-50"
              }
            />
          )}

          {/* Destination Account Selector (Always visible, changes styles dynamically) */}
          <AccountSelector
            label=
            {i18n.t(`transaction.${isIncome ? "SELECT_ACCOUNT_TO_ADD_INCOME" : "TO_ACCOUNT"}`)}

            account={toAccount}
            onPress={() => setShowToModal(true)}
            iconName={isIncome ? 'add-circle' : "arrow-down-circle"}
            iconColor={
              !toAccount
                ? isIncome
                  ? "#059669"
                  : "#DC2626"
                : toAccount.type === "SAVINGS" || toAccount.type === "GOAL"
                  ? "#059669"
                  : "#DC2626"
            }
            iconBgClass={
              !toAccount
                ? isIncome
                  ? "bg-emerald-50"
                  : "bg-red-50"
                : toAccount.type === "SAVINGS" || toAccount.type === "GOAL"
                  ? "bg-emerald-50"
                  : "bg-red-50"
            }
          />

          {/* Inputs */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">{i18n.t("transaction.AMOUNT")}</Text>
            <View className="bg-white rounded-2xl border border-gray-200 px-4 py-2 flex-row items-center">
              <Ionicons name="cash-outline" size={20} color="#9ca3af" />
              <TextInput className="flex-1 ml-3 text-gray-900 text-2xl font-bold py-3" placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
              <Text className="text-gray-400 font-semibold">{user!.currency}</Text>
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
            <Text className="text-gray-700 font-bold text-center">{i18n.t("common.cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-emerald-600 rounded-2xl py-4 shadow-lg" onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white font-bold text-center">
              {i18n.t("transaction.TRANSFER")}</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals Tree */}
      <AccountModal
        visible={showFromModal}
        title={i18n.t("transaction.SELECT_SOURCE_ACCOUNT")}
        accounts={accounts}
        selectedAccountId={fromAccount?.id}
        isIncome={false}
        iconName="arrow-up-circle"
        onClose={() => setShowFromModal(false)}
        onSelect={(acc) => {
          setFromAccount(acc);
          setShowFromModal(false);
        }}
      />

      <AccountModal
        visible={showToModal}
        title={i18n.t("transaction.SELECT_DESTINATION")}
        accounts={
          isIncome
            ? savingsAccounts
            : targetTransferAccounts.filter(
              (acc) => acc.id !== fromAccount?.id
            )
        }
        selectedAccountId={toAccount?.id}
        isIncome={isIncome}
        iconName={isIncome ? "add-circle" : "arrow-down-circle"}
        onClose={() => setShowToModal(false)}
        onSelect={(acc) => {
          setToAccount(acc);
          setShowToModal(false);
        }}
      />
    </View>
  );
}
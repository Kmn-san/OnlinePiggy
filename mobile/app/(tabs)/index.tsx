import { View, Text, FlatList, ActivityIndicator, StatusBar } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import i18n from "../../lib/i18n";
import { useLanguage } from "../../context/languageContext";
import useAccounts from "../../hooks/useAccounts";

import { HomeHeader } from "../../components/home/HomeHeader";
import { HomeSectionTitle } from "../../components/home/HomeSectionTitle";
import { SavingsAccountCard } from "../../components/home/SavingsAccountCard";
import { FloatingActionButton } from "../../components/home/FloatingActionButton";

interface Account {
  id: string;
  name: string;
  type: string;
  currency: string;
  current_balance: number;
  target_amount?: number;
}

export default function Home() {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  i18n.locale = language;

  const { accounts, isLoading } = useAccounts();

  // Filter accounts intended for this section
  const savingsAccounts = accounts?.filter(
    (account: Account) => account.type === "SAVINGS" || account.type === "GOAL"
  ) || [];

  const totalBalance = savingsAccounts.reduce(
    (sum: number, account: Account) => sum + (account.current_balance || 0),
    0
  );

  const primaryCurrency = savingsAccounts[0]?.currency || "USD";

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />

      <Tabs.Screen
        options={{
          title: i18n.t("tabs.home"),
          headerShown: false,
        }}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-gray-500 mt-3 text-sm">Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={savingsAccounts}
          keyExtractor={(item: Account) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
          ListHeaderComponent={
            <>
              <HomeHeader
                totalBalance={totalBalance}
                primaryCurrency={primaryCurrency}
                accountCount={savingsAccounts.length}
              />
              <HomeSectionTitle count={savingsAccounts.length} />
            </>
          }
          renderItem={({ item }) => <SavingsAccountCard item={item} />}
        />
      )}

      <FloatingActionButton />
    </View>
  );
}
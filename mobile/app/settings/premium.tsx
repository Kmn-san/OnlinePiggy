import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLanguage } from "../../context/languageContext";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../lib/i18n";
import { useSubscription } from "../../hooks/useSubscription";
import PricingCard from "../../components/premium/PricingCard";
import PageHeader from "@/components/PageHeader";

const PRICING_PLANS = [
    {
        name: 'Starter',
        price: 'RM 0',
        features: ['Basic Functions', 'Normal Savings', 'Normal Expenses', 'Text With Bot'],
        cta: 'Current Plan',
        isCurrent: true,
        id: 'starter',
        clerkPriceId: null
    },
    {
        name: 'Premium',
        price: 'RM 50',
        features: ['Unlock Full Savings', 'Unlock Full Expenses', 'Real-time AI Chat room assistant'],
        cta: 'Unlock Premium',
        isCurrent: false,
        id: 'premium',
        clerkPriceId: 'price_premium_id'
    }
];

export default function Premium() {
    const { language } = useLanguage();
    i18n.locale = language;

    const {
        loading,
        selectedPlan,
        isPremium,
        user,
        handleSubscribe,
        handleRestorePurchase
    } = useSubscription();

    // Force Clerk's unknown metadata types into absolute booleans
    const hasPurchasedBefore = !!user?.publicMetadata?.hasPurchased;
    const showRestoreButton = !!isPremium || hasPurchasedBefore;

    return (
        <View className="flex-1 bg-white">
            <PageHeader
                title="Premium"
                subtitle="Choose the plan that fits your needs"
                iconName="diamond"
                iconColor="#8B5CF6"
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {!!isPremium && (
                    <View className="mx-6 mt-6 bg-green-50 rounded-xl p-4 border border-green-200">
                        <View className="flex-row items-center">
                            <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                            <Text className="text-green-700 font-semibold ml-2">Premium Active</Text>
                        </View>
                        <Text className="text-green-600 mt-1">
                            You have access to all premium features
                        </Text>
                    </View>
                )}

                <View className="px-6 py-6">
                    {PRICING_PLANS.map((plan) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            isPremium={!!isPremium} // Explicit boolean
                            loading={loading}
                            selectedPlan={selectedPlan}
                            onSubscribe={handleSubscribe}
                        />
                    ))}

                    {/* Fixed the unknown assignment error here */}
                    {showRestoreButton && (
                        <TouchableOpacity
                            onPress={handleRestorePurchase}
                            disabled={loading}
                            className="py-3 mt-2"
                        >
                            <Text className="text-purple-600 text-center font-semibold">
                                Restore Purchase
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View className="mt-6 pt-6 border-t border-gray-200 mb-8">
                        <View className="flex-row justify-center items-center">
                            <Ionicons name="shield-checkmark" size={20} color="#9CA3AF" />
                            <Text className="text-gray-400 text-sm ml-2">
                                Secure payment • Cancel anytime
                            </Text>
                        </View>
                        <Text className="text-gray-400 text-sm text-center mt-2">
                            Premium subscription automatically renews unless canceled
                        </Text>
                        {!isPremium && (
                            <TouchableOpacity onPress={() => Alert.alert('Info', 'Starter plan is free forever')} className="mt-4">
                                <Text className="text-gray-400 text-xs text-center">Questions? Contact support</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
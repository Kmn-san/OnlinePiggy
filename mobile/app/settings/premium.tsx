import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useLanguage } from "../../context/languageContext";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../lib/i18n";
import PricingCard from "../../components/premium/PricingCard";
import PageHeader from "@/components/PageHeader";
import { useMemo, useEffect, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useSubscription } from "@/hooks/useSubscription"; // ⬅️ Import your subscription hook
import { useApi } from "@/lib/api";

export default function Premium() {
    const api = useApi();
    const { language } = useLanguage();
    i18n.locale = language;

    // 🎯 FIX: Added () to execute the hook properly
    const { user } = useCurrentUser();
    console.log(user);

    // 🎯 Hook integration replaces hardcoded local variables
    const { loading, isPremium, handleSubscribe, checkPremiumStatus } = useSubscription();

    // Manage which plan card is highlighted or selected (defaults to premium product)
    const [selectedPlan, setSelectedPlan] = useState('premium');
    const [restoring, setRestoring] = useState(false);

    // 🎯 Run status check against PostgreSQL database immediately on mount
    useEffect(() => {
        checkPremiumStatus();
    }, []);

    // ✨ Dynamically assemble pricing plans, refreshing with language switches or subscription status changes
    const pricingPlans = useMemo(() => [
        {
            id: 'starter',
            name: i18n.t('premium.plans.starter.name'),
            price: 'RM 0',
            features: [
                i18n.t('premium.plans.starter.feature_basic'),
                i18n.t('premium.plans.starter.feature_savings'),
                i18n.t('premium.plans.starter.feature_expenses'),
                i18n.t('premium.plans.starter.feature_bot')
            ],
            cta: i18n.t('premium.plans.starter.cta'),
            isCurrent: !isPremium, // 💡 Dynamic check: If not premium, then current plan is starter
            clerkPriceId: null
        },
        {
            id: 'premium',
            name: i18n.t('premium.plans.premium.name'),
            price: 'RM 50',
            features: [
                i18n.t('premium.plans.premium.feature_savings'),
                i18n.t('premium.plans.premium.feature_expenses'),
                i18n.t('premium.plans.premium.feature_ai')
            ],
            cta: i18n.t('premium.plans.premium.cta'),
            isCurrent: !!isPremium, // 💡 Dynamic check: If premium, then current plan is premium
            clerkPriceId: 'price_premium_id'
        }
    ], [language, isPremium]); // 🔒 Dependencies to recalculate on language or premium status updates

    // Optional: Restore Purchase action linked to your backend endpoint
    const handleRestorePurchase = async () => {
        if (!api) return;
        try {
            setRestoring(true);
            const response = await api.post('/payment/restore-purchase');
            if (response.data?.is_premium) {
                await checkPremiumStatus();
                Alert.alert('Restored', 'Your premium access has been successfully restored.');
            } else {
                Alert.alert('No Purchase Found', 'We couldn’t find an active historical transaction for this account.');
            }
        } catch (error) {
            console.error("Error restoring purchase:", error);
            Alert.alert('Error', 'Could not communicate with the billing server.');
        } finally {
            setRestoring(false);
        }
    };

    const hasPurchasedBefore = user?.premium_expire_at !== null;
    const showRestoreButton = !isPremium || hasPurchasedBefore;

    return (
        <View className="flex-1 bg-white">
            {/* 1. Header Internationalization */}
            <PageHeader
                title={i18n.t("premium.header.title")}
                subtitle={i18n.t("premium.header.subtitle")}
                iconName="diamond"
                iconColor="#8B5CF6"
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* 2. Active Status Banner Internationalization */}
                {!!isPremium && (
                    <View className="mx-6 mt-6 bg-green-50 rounded-xl p-4 border border-green-200">
                        <View className="flex-row items-center">
                            <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                            <Text className="text-green-700 font-semibold ml-2">
                                {i18n.t("premium.status.active")}
                            </Text>
                        </View>
                        <Text className="text-green-600 mt-1">
                            {i18n.t("premium.status.description")}
                        </Text>
                    </View>
                )}

                <View className="px-6 py-6">
                    {/* Render dynamically calculated pricingPlans */}
                    {pricingPlans.map((plan) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            isPremium={!!isPremium}
                            loading={loading}
                            selectedPlan={selectedPlan}
                            onSubscribe={handleSubscribe}
                        />
                    ))}

                    {/* 3. Restore Purchase Button Internationalization */}
                    {showRestoreButton && (
                        <TouchableOpacity
                            onPress={handleRestorePurchase}
                            disabled={loading || restoring}
                            className="py-3 mt-2"
                        >
                            {restoring ? (
                                <ActivityIndicator color="#8B5CF6" />
                            ) : (
                                <Text className="text-purple-600 text-center font-semibold">
                                    {i18n.t("premium.actions.restore")}
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}

                    {/* 4. Footer Secure Info & Terms Internationalization */}
                    <View className="mt-6 pt-6 border-t border-gray-200 mb-8">
                        <View className="flex-row justify-center items-center">
                            <Ionicons name="shield-checkmark" size={20} color="#9CA3AF" />
                            <Text className="text-gray-400 text-sm ml-2">
                                {i18n.t("premium.footer.secure")}
                            </Text>
                        </View>
                        <Text className="text-gray-400 text-sm text-center mt-2">
                            {i18n.t("premium.footer.renewal")}
                        </Text>

                        {!isPremium && (
                            <TouchableOpacity
                                onPress={() => Alert.alert(
                                    i18n.t('premium.alert.info'),
                                    i18n.t('premium.alert.freeForever')
                                )}
                                className="mt-4"
                            >
                                <Text className="text-gray-400 text-xs text-center">
                                    {i18n.t("premium.footer.support")}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
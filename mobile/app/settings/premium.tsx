import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useLanguage } from "../../context/languageContext";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../lib/i18n";
import PricingCard from "../../components/premium/PricingCard";
import PageHeader from "@/components/PageHeader";
import { useMemo, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function Premium() {
    const { language } = useLanguage();
    i18n.locale = language;

    const { user } = useCurrentUser();

    // 🚀 Demo state replacing useSubscription
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('premium');
    const [restoring, setRestoring] = useState(false);

    // 🚀 RevenueCat Demo Subscribe & Cancel Handler
    const handleSubscribeDemo = async (plan: any) => {
        setSelectedPlan(plan.id);

        if (plan.id === 'starter') {
            if (isPremium) {
                // 🛑 Demo behavior for canceling / downgrading
                Alert.alert(
                    i18n.t("premium.demo.cancelTitle", { defaultValue: "Manage Subscription (Demo)" }),
                    i18n.t("premium.demo.cancelMessage", {
                        defaultValue: "In production, subscriptions are canceled via your Apple ID or Google Play settings. Would you like to simulate downgrading to the Starter plan for testing?"
                    }),
                    [
                        { text: i18n.t("common.cancel", { defaultValue: "Keep Premium" }), style: "cancel" },
                        {
                            text: i18n.t("premium.demo.confirmDowngrade", { defaultValue: "Simulate Downgrade" }),
                            style: "destructive",
                            onPress: () => {
                                setIsPremium(false);
                                Alert.alert("Success", "Switched back to Starter plan.");
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    i18n.t("common.info", { defaultValue: "Notice" }),
                    i18n.t("premium.demo.starterSelected", { defaultValue: "You are already on the Starter plan." })
                );
            }
            return;
        }

        // Simulating the RevenueCat purchase flow for Premium
        Alert.alert(
            i18n.t("premium.demo.title", { defaultValue: "RevenueCat Purchase (Demo)" }),
            i18n.t("premium.demo.message", { defaultValue: "RevenueCat SDK integration pending. In production, this opens the native iOS App Store / Google Play billing sheet." }),
            [
                { text: i18n.t("common.cancel", { defaultValue: "Cancel" }), style: "cancel" },
                {
                    text: "Simulate Success",
                    onPress: () => {
                        setIsPremium(true);
                        Alert.alert("Success", "Demo subscription activated successfully!");
                    }
                }
            ]
        );
    };

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
            isCurrent: !isPremium,
            clerkPriceId: null
        },
        {
            id: 'premium',
            name: i18n.t('premium.plans.premium.name'),
            price: 'RM 12',
            features: [
                i18n.t('premium.plans.premium.feature_savings'),
                i18n.t('premium.plans.premium.feature_expenses'),
                i18n.t('premium.plans.premium.feature_ai')
            ],
            cta: i18n.t('premium.plans.premium.cta'),
            isCurrent: !!isPremium,
            clerkPriceId: 'price_premium_id'
        }
    ], [language, isPremium]);

    const handleRestorePurchase = async () => {
        try {
            setRestoring(true);
            // Simulating RevenueCat restore action
            setTimeout(() => {
                setRestoring(false);
                setIsPremium(true);
                Alert.alert('Restored', 'Your demo premium access has been successfully restored.');
            }, 1000);
        } catch (error) {
            console.error("Error restoring purchase:", error);
            setRestoring(false);
            Alert.alert('Error', 'Could not restore purchases.');
        }
    };

    const hasPurchasedBefore = user?.premium_expire_at !== null;
    const showRestoreButton = !isPremium || hasPurchasedBefore;

    return (
        <View className="flex-1 bg-white">
            <PageHeader
                title={i18n.t("premium.header.title")}
                subtitle={i18n.t("premium.header.subtitle")}
                iconName="diamond"
                iconColor="#8B5CF6"
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
                    {pricingPlans.map((plan) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            isPremium={!!isPremium}
                            loading={loading}
                            selectedPlan={selectedPlan}
                            onSubscribe={handleSubscribeDemo}
                        />
                    ))}

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
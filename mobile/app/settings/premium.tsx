import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useLanguage } from "../../context/languageContext";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../lib/i18n";
import PricingCard from "../../components/premium/PricingCard";
import PageHeader from "@/components/PageHeader";
import { useEffect, useMemo, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { PricingPlan } from "@/types";

export default function Premium() {
    const { language } = useLanguage();
    i18n.locale = language;

    const { user } = useCurrentUser();

    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    // 🚀 Fetch Offerings & Customer Status on Mount
    useEffect(() => {
        loadRevenueCatData();
    }, []);

    const loadRevenueCatData = async () => {
        try {
            setLoading(true);

            // Check current subscription status from RevenueCat
            const customerInfo = await Purchases.getCustomerInfo();
            updateSubscriptionStatus(customerInfo);

            // Fetch live offerings/packages with a safety check
            const offerings = await Purchases.getOfferings();
            const activeOffering = offerings.current || Object.values(offerings.all)[0];

            if (activeOffering && activeOffering.availablePackages.length > 0) {
                setPackages(activeOffering.availablePackages);
            }
        } catch (error) {
            console.error("Error loading RevenueCat offerings:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateSubscriptionStatus = (customerInfo: any) => {
        // Replace "premium" with your actual RevenueCat Entitlement Identifier if different
        const activeEntitlement = customerInfo.entitlements.active["premium"] || Object.values(customerInfo.entitlements.active)[0];
        setIsPremium(!!activeEntitlement);
    };

    // 🚀 Handle Live Purchase via RevenueCat
    const handleSubscribe = async (plan: any) => {
        if (plan.id === 'starter') {
            if (isPremium) {
                Alert.alert(
                    i18n.t("premium.demo.cancelTitle", { defaultValue: "Manage Subscription" }),
                    i18n.t("premium.demo.cancelMessage", {
                        defaultValue: "Subscriptions are managed via your Apple ID or Google Play account settings."
                    }),
                    [{ text: i18n.t("common.cancel", { defaultValue: "OK" }), style: "cancel" }]
                );
            } else {
                Alert.alert(
                    i18n.t("common.info", { defaultValue: "Notice" }),
                    i18n.t("premium.demo.starterSelected", { defaultValue: "You are already on the Starter plan." })
                );
            }
            return;
        }

        // Use 'let' instead of 'const' so it can be reassigned if fallback runs
        let targetPackage = packages.find((pkg) => pkg.identifier === plan.id || pkg.product.identifier === plan.clerkPriceId);

        if (!targetPackage && packages.length > 0) {
            targetPackage = packages[0];
        }

        if (!targetPackage) {
            Alert.alert("Error", "No subscription package available at the moment.");
            return;
        }

        try {
            setLoading(true);
            setSelectedPlanId(plan.id);

            const { customerInfo } = await Purchases.purchasePackage(targetPackage);
            updateSubscriptionStatus(customerInfo);
            Alert.alert("Success", "Subscription activated successfully!");
        } catch (error: any) {
            if (!error.userCancelled) {
                Alert.alert("Purchase Failed", error.message || "An error occurred during checkout.");
            }
        } finally {
            setLoading(false);
            setSelectedPlanId(null);
        }
    };

    // 🚀 Handle Restore Purchases
    const handleRestorePurchase = async () => {
        try {
            setRestoring(true);
            const customerInfo = await Purchases.restorePurchases();
            updateSubscriptionStatus(customerInfo);

            const hasActive = Object.keys(customerInfo.entitlements.active).length > 0;
            if (hasActive) {
                Alert.alert('Restored', 'Your premium access has been successfully restored.');
            } else {
                Alert.alert('No Active Subscription', 'No active purchases were found to restore.');
            }
        } catch (error: any) {
            console.error("Error restoring purchase:", error);
            Alert.alert('Error', error.message || 'Could not restore purchases.');
        } finally {
            setRestoring(false);
        }
    };

    // 🚀 Dynamic Pricing Plans Mapping (Starter + RevenueCat Packages)
    const pricingPlans = useMemo(() => {
        const plans: PricingPlan[] = [
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
            }
        ];

        if (packages.length > 0) {
            packages.forEach((pkg) => {
                plans.push({
                    id: pkg.identifier,
                    name: pkg.product.title || i18n.t('premium.plans.premium.name'),
                    price: pkg.product.priceString || 'RM 12',
                    features: [
                        i18n.t('premium.plans.premium.feature_savings'),
                        i18n.t('premium.plans.premium.feature_expenses'),
                        i18n.t('premium.plans.premium.feature_ai')
                    ],
                    cta: i18n.t('premium.plans.premium.cta'),
                    isCurrent: !!isPremium,
                    clerkPriceId: pkg.product.identifier
                });
            });
        } else {
            plans.push({
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
            });
        }

        return plans;
    }, [language, isPremium, packages]);

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
                            selectedPlan={selectedPlanId || ''}
                            onSubscribe={handleSubscribe}
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
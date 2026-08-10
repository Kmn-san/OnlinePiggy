import { useState, useEffect, useMemo, useCallback } from 'react';
import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import i18n from '../lib/i18n';
import { PricingPlan } from '@/types';
import useCurrentUser from './useCurrentUser';

export function useSubscription() {
    // 🚀 Grab user and updatePremium mutation from useCurrentUser
    const { user, updatePremium } = useCurrentUser();

    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    const updateSubscriptionStatus = (customerInfo: CustomerInfo) => {
        const activeEntitlementsList = Object.values(customerInfo.entitlements.active);
        const activeEntitlement =
            customerInfo.entitlements.active["Online Piggy Premium"] ||
            activeEntitlementsList[0];

        setIsPremium(!!activeEntitlement);
        return !!activeEntitlement;
    };

    const loadRevenueCatData = useCallback(async () => {
        try {
            setLoading(true);
            const customerInfo = await Purchases.getCustomerInfo();
            const active = updateSubscriptionStatus(customerInfo);

            // 🚀 Auto-sync with backend if RevenueCat says active, but backend database says false
            if (active && user && !user.is_premium) {
                const activeEntitlement = Object.values(customerInfo.entitlements.active)[0] as any;
                await updatePremium.mutateAsync({
                    packageIdentifier: activeEntitlement?.productIdentifier || 'premium',
                    entitlements: customerInfo.entitlements.active,
                });
                console.log("Auto-synced active subscription with backend.");
            }

            const offeringsData = await Purchases.getOfferings();
            const activeOffering = offeringsData.current || Object.values(offeringsData.all)[0];
            if (activeOffering && activeOffering.availablePackages.length > 0) {
                setPackages(activeOffering.availablePackages);
            }
        } catch (error) {
            console.error("Error loading RevenueCat offerings:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadRevenueCatData();
    }, [loadRevenueCatData]);

    const handleSubscribe = async (plan: PricingPlan) => {
        if (plan.id === 'starter') return;

        try {
            setLoading(true);
            setSelectedPlanId(plan.id);

            const targetPackage = packages.find(pkg => pkg.identifier === plan.id) || packages[0];
            if (!targetPackage) {
                Alert.alert("Error", "Selected subscription package could not be found.");
                return;
            }

            const { customerInfo } = await Purchases.purchasePackage(targetPackage);
            const active = updateSubscriptionStatus(customerInfo);

            if (active) {
                try {
                    await updatePremium.mutateAsync({
                        packageIdentifier: targetPackage.identifier,
                        entitlements: customerInfo.entitlements.active,
                    });
                    console.log("Backend successfully synced with subscription.");
                } catch (backendError) {
                    console.error("Failed to sync subscription with backend:", backendError);
                }

                Alert.alert("Success!", "You have successfully unlocked Premium.");
                router.replace("/");
            }
        } catch (error: any) {
            if (!error.userCancelled) {
                console.error("Purchase error:", error);
                Alert.alert("Purchase Failed", error.message || "Could not complete the purchase.");
            }
        } finally {
            setLoading(false);
            setSelectedPlanId(null);
        }
    };

    const handleRestorePurchase = async () => {
        try {
            setRestoring(true);
            const customerInfo = await Purchases.restorePurchases();
            const active = updateSubscriptionStatus(customerInfo);

            if (active) {
                const activeEntitlement = Object.values(customerInfo.entitlements.active)[0] as any;
                await updatePremium.mutateAsync({
                    packageIdentifier: activeEntitlement?.productIdentifier || 'premium',
                    entitlements: customerInfo.entitlements.active,
                });

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
                    name: i18n.t('premium.plans.premium.name'),
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
    }, [isPremium, packages]);

    const hasPurchasedBefore = user?.premium_expire_at !== null;
    const showRestoreButton = !isPremium || hasPurchasedBefore;

    return {
        isPremium,
        loading,
        restoring,
        selectedPlanId,
        pricingPlans,
        showRestoreButton,
        handleSubscribe,
        handleRestorePurchase,
    };
}
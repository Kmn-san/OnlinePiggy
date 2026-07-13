import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { PricingPlan } from '@/types';
import i18n from '@/lib/i18n';


export function useSubscription() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const isPremium = user?.publicMetadata?.isPremium || false;

    const verifySubscription = async () => {
        try {
            const token = await getToken();
            const response = await fetch('YOUR_BACKEND_URL/api/verify-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user?.id }),
            });

            const data = await response.json();

            if (data.isPremium) {
                Alert.alert('Success! 🎉', 'Welcome to Premium! You now have access to all premium features.');
                await user?.reload();
            }
        } catch (error) {
            console.error('Verification error:', error);
        }
    };

    // 2. Added explicit type to the plan parameter
    const handleSubscribe = async (plan: PricingPlan) => {
        if (plan.isCurrent) {
            Alert.alert('Info', 'You are currently on the Starter plan');
            return;
        }

        try {
            setLoading(true);
            setSelectedPlan(plan.id);
            const token = await getToken();

            const response = await fetch('YOUR_BACKEND_URL/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    priceId: plan.clerkPriceId,
                    userId: user?.id,
                    planId: plan.id,
                    successUrl: 'yourapp://premium/success',
                    cancelUrl: 'yourapp://premium/cancel',
                }),
            });

            const data = await response.json();

            if (data.url) {
                // Open the checkout system
                await WebBrowser.openBrowserAsync(data.url);

                // 3. Fixed Type Overlap: Once the user finishes and closes the WebBrowser 
                // (whether it was dismissed or auto-redirected), trigger verification checks.
                await verifySubscription();
            }
        } catch (error) {
            Alert.alert(i18n.t('common.error'), 'Failed to start subscription process');
            console.error('Subscription error:', error);
        } finally {
            setLoading(false);
            setSelectedPlan(null);
        }
    };

    const handleRestorePurchase = async () => {
        try {
            setLoading(true);
            const token = await getToken();

            const response = await fetch('YOUR_BACKEND_URL/api/restore-purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user?.id }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert('Success', 'Your premium status has been restored!');
                await user?.reload();
            } else {
                Alert.alert('Info', 'No active subscription found.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to restore purchase');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        selectedPlan,
        isPremium,
        user,
        handleSubscribe,
        handleRestorePurchase
    };
}
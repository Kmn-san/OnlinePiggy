import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useStripe } from '@stripe/stripe-react-native';
import i18n from '@/lib/i18n';
import { useApi } from '@/lib/api';

export function useSubscription() {
    const api = useApi();
    const { user } = useUser();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    // Check premium status. You can track this in state or via a DB fetch
    const [isPremium, setIsPremium] = useState(false);

    // 1. Fetch latest subscription status directly from your Postgres DB
    const checkPremiumStatus = async () => {
        if (!api) return;
        try {
            const response = await api.get('/payment/status');
            setIsPremium(!!response.data?.is_premium);
        } catch (error) {
            console.error('Error fetching user premium status:', error);
        }
    };

    // 2. Poll/Verify after Stripe Sheet closes to give the Webhook time to finish
    const verifySubscription = async () => {
        try {
            setLoading(true);
            // Give Stripe's webhook 2 seconds to write to PostgreSQL
            await new Promise((resolve) => setTimeout(resolve, 2000));

            if (api) {
                const response = await api.get('/payment/status');
                const updatedStatus = !!response.data?.is_premium;
                setIsPremium(updatedStatus);

                if (updatedStatus) {
                    Alert.alert('Success! 🎉', 'Welcome to Premium! Your features are now active.');
                } else {
                    Alert.alert('Processing...', 'Your payment went through! It may take a minute for your profile to update.');
                }
            }
        } catch (error) {
            console.error('Verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Initiate checkout process
    const handleSubscribe = async () => {
        if (isPremium) {
            Alert.alert('Info', 'You already have an active premium subscription!');
            return;
        }

        if (!api) {
            Alert.alert('Error', 'API connection is not ready.');
            return;
        }

        try {
            setLoading(true);
            const token = await getToken();

            // Fetch Client Secret from your paymentController.js
            const response = await api.post('/payment/create-intent', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const clientSecret = response.data?.clientSecret;
            if (!clientSecret) {
                throw new Error('Failed to retrieve checkout details from server.');
            }

            // Initialize Native Mobile Stripe Payment Sheet
            const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'OnlinePiggy', returnURL: 'mypiggyapp://stripe-redirect',
            });

            if (initError) {
                Alert.alert('Error', 'Failed to load checkout sheet.');
                console.error('Stripe Init Error:', initError);
                return;
            }

            // Present the native checkout modal
            const { error: presentError } = await presentPaymentSheet();

            if (presentError) {
                if (presentError.code === 'Canceled') {
                    console.log('User closed payment sheet');
                    return;
                }
                throw new Error(presentError.message);
            }

            // Wait for Webhook to execute on backend, then update UI state
            await verifySubscription();

        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message;
            Alert.alert(i18n.t('common.error'), errorMessage || 'Payment could not be completed.');
            console.error('Payment Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        isPremium,
        handleSubscribe,
        checkPremiumStatus,
    };
}
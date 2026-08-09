import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useLanguage } from "../../context/languageContext";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../lib/i18n";
import PricingCard from "../../components/premium/PricingCard";
import PageHeader from "@/components/PageHeader";
import { useSubscription } from "@/hooks/useSubscription";

export default function Premium() {
    const { language } = useLanguage();
    i18n.locale = language;

    const {
        isPremium,
        loading,
        restoring,
        selectedPlanId,
        pricingPlans,
        showRestoreButton,
        handleSubscribe,
        handleRestorePurchase,
    } = useSubscription();

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
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PricingCardProps } from '@/types';
import i18n from '@/lib/i18n';

export default function PricingCard({
    plan,
    isPremium,
    loading,
    selectedPlan,
    onSubscribe
}: PricingCardProps) {
    const isPremiumPlan = plan.id === 'premium';
    const isRecommended = isPremiumPlan && !plan.isCurrent && !isPremium;
    const isActive = isPremium && isPremiumPlan;

    return (
        <View className={`mb-4 rounded-2xl p-6 border ${isPremiumPlan
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-200 bg-white'
            } ${plan.isCurrent ? 'opacity-75' : ''}`}>

            {isRecommended && (
                <View className="absolute top-0 right-0 bg-purple-500 rounded-tr-2xl rounded-bl-xl px-4 py-1">
                    <Text className="text-white text-xs font-bold">
                        {i18n.t("premium.labels.recommended")}
                    </Text>
                </View>
            )}

            {isActive && (
                <View className="absolute top-0 right-0 bg-green-500 rounded-tr-2xl rounded-bl-xl px-4 py-1">
                    <Text className="text-white text-xs font-bold">
                        {i18n.t("premium.labels.active")}
                    </Text>
                </View>
            )}

            <Text className="text-xl font-bold text-gray-800">{plan.name}</Text>

            <View className="flex-row items-end mt-2">
                <Text className="text-4xl font-bold text-gray-900">{plan.price}</Text>
                {isPremiumPlan && (
                    <Text className="text-gray-500 ml-2 mb-1">
                        {i18n.t("premium.labels.perMonth")}
                    </Text>
                )}
            </View>

            <View className="mt-4">
                {plan.features.map((feature, idx) => (
                    <View key={idx} className="flex-row items-center mt-2">
                        <Ionicons
                            name={isActive ? "checkmark-circle" : "checkmark-circle-outline"}
                            size={20}
                            color={isPremiumPlan ? "#8B5CF6" : "#9CA3AF"}
                        />
                        <Text className={`ml-2 ${isPremiumPlan ? 'text-gray-700' : 'text-gray-500'}`}>
                            {feature}
                        </Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                onPress={() => onSubscribe(plan)}
                disabled={loading || plan.isCurrent}
                className={`py-4 rounded-xl items-center justify-center shadow-md ${plan.id === 'starter'
                        ? 'bg-gray-100' // Neutral for free plan
                        : 'bg-purple-600 shadow-purple-200' // 💜 Vibrant Purple & Shadow for Premium!
                    } ${loading && selectedPlan === plan.id ? 'opacity-70' : ''}`}
            >
                <Text
                    className={`font-bold text-base ${plan.id === 'starter' ? 'text-gray-700' : 'text-white'
                        }`}
                >
                    {plan.cta}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
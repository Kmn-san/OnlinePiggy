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
                disabled={loading || plan.isCurrent || isPremium}
                className={`mt-6 py-3 rounded-full ${plan.isCurrent || isPremium
                    ? 'bg-gray-200'
                    : isPremiumPlan
                        ? 'bg-purple-600'
                        : 'bg-gray-300'
                    } ${loading && selectedPlan === plan.id ? 'opacity-50' : ''}`}
            >
                <Text className={`text-center font-semibold ${plan.isCurrent || isPremium
                    ? 'text-gray-600'
                    : isPremiumPlan
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}>
                    {loading && selectedPlan === plan.id ? (
                        <ActivityIndicator color={isPremiumPlan ? 'white' : 'gray'} />
                    ) : isActive ? (
                        i18n.t("premium.labels.activeStatus")
                    ) : plan.isCurrent ? (
                        i18n.t("premium.labels.currentPlan")
                    ) : (
                        plan.cta
                    )}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
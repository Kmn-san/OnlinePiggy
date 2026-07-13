import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PricingCardProps } from '@/types';


export default function PricingCard({
    plan,
    isPremium,
    loading,
    selectedPlan,
    onSubscribe
}: PricingCardProps) {
    const isRecommended = plan.name === 'Premium' && !plan.isCurrent && !isPremium;
    const isActive = isPremium && plan.name === 'Premium';

    return (
        <View className={`mb-4 rounded-2xl p-6 border ${plan.name === 'Premium'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white'
            } ${plan.isCurrent ? 'opacity-75' : ''}`}>

            {isRecommended && (
                <View className="absolute top-0 right-0 bg-purple-500 rounded-tr-2xl rounded-bl-xl px-4 py-1">
                    <Text className="text-white text-xs font-bold">RECOMMENDED</Text>
                </View>
            )}

            {isActive && (
                <View className="absolute top-0 right-0 bg-green-500 rounded-tr-2xl rounded-bl-xl px-4 py-1">
                    <Text className="text-white text-xs font-bold">ACTIVE</Text>
                </View>
            )}

            <Text className="text-xl font-bold text-gray-800">{plan.name}</Text>

            <View className="flex-row items-end mt-2">
                <Text className="text-4xl font-bold text-gray-900">{plan.price}</Text>
                {plan.name === 'Premium' && (
                    <Text className="text-gray-500 ml-2 mb-1">/ month</Text>
                )}
            </View>

            <View className="mt-4">
                {plan.features.map((feature, idx) => (
                    <View key={idx} className="flex-row items-center mt-2">
                        <Ionicons
                            name={isActive ? "checkmark-circle" : "checkmark-circle-outline"}
                            size={20}
                            color={plan.name === 'Premium' ? "#8B5CF6" : "#9CA3AF"}
                        />
                        <Text className={`ml-2 ${plan.name === 'Premium' ? 'text-gray-700' : 'text-gray-500'}`}>
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
                        : plan.name === 'Premium'
                            ? 'bg-purple-600'
                            : 'bg-gray-300'
                    } ${loading && selectedPlan === plan.id ? 'opacity-50' : ''}`}
            >
                <Text className={`text-center font-semibold ${plan.isCurrent || isPremium
                        ? 'text-gray-600'
                        : plan.name === 'Premium'
                            ? 'text-white'
                            : 'text-gray-700'
                    }`}>
                    {loading && selectedPlan === plan.id ? (
                        <ActivityIndicator color={plan.name === 'Premium' ? 'white' : 'gray'} />
                    ) : isActive ? (
                        '✅ Active'
                    ) : plan.isCurrent ? (
                        'Current Plan'
                    ) : (
                        plan.cta
                    )}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
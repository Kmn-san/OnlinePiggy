import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PricingCardProps } from "@/types";
import i18n from "@/lib/i18n";

export default function PricingCard({
  plan,
  isPremium,
  loading,
  selectedPlan,
  onSubscribe,
}: PricingCardProps) {

  // Your actual RevenueCat product ID
  const isPremiumPlan = plan.id === '$rc_monthly';

  // Premium user is currently on this plan
  const isActive = isPremium && isPremiumPlan;

  // Show recommended only to users who are not premium
  const isRecommended = isPremiumPlan && !isPremium;

  const handleSelectPlan = () => {
    // Already on this plan
    if (isActive) {
      return;
    }

    // User is premium and is trying to select Starter
    if (!isPremiumPlan && isPremium) {
      Alert.alert(
        i18n.t("premium.cancel.title"),
        i18n.t("premium.cancel.message"),
        [
          {
            text: i18n.t("common.cancel"),
            style: "cancel",
          },
          {
            text: i18n.t("premium.cancel.confirm"),
            style: "destructive",
            onPress: () => {
              onSubscribe(plan);
            },
          },
        ]
      );

      return;
    }

    // Normal subscription
    onSubscribe(plan);
  };

  // Button text
  const getButtonText = () => {
    if (isActive) {
      return i18n.t(
        "premium.labels.currentPlan",
        {
          defaultValue: "This is your current plan",
        }
      );
    }

    if (!isPremiumPlan && isPremium) {
      return i18n.t(
        "premium.labels.selectPlan",
        {
          defaultValue: "Select this plan",
        }
      );
    }

    return plan.cta;
  };

  return (
    <View
      className={`mb-4 rounded-2xl p-6 border ${
        isPremiumPlan
          ? "border-purple-500 bg-purple-50"
          : "border-gray-200 bg-white"
      } ${isActive ? "opacity-75" : ""}`}
    >

      {/* Recommended */}
      {isRecommended && (
        <View className="absolute top-0 right-0 bg-purple-500 rounded-tr-2xl rounded-bl-xl px-4 py-1">
          <Text className="text-white text-xs font-bold">
            {i18n.t("premium.labels.recommended")}
          </Text>
        </View>
      )}

      {/* Current Plan */}
      {isActive && (
        <View className="absolute top-0 right-0 bg-green-500 rounded-tr-2xl rounded-bl-xl px-4 py-1">
          <Text className="text-white text-xs font-bold">
            {i18n.t("premium.labels.active")}
          </Text>
        </View>
      )}

      {/* Plan Name */}
      <Text className="text-xl font-bold text-gray-800">
        {plan.name}
      </Text>

      {/* Price */}
      <View className="flex-row items-end mt-2">
        <Text className="text-4xl font-bold text-gray-900">
          {plan.price}
        </Text>

        {isPremiumPlan && (
          <Text className="text-gray-500 ml-2 mb-1">
            {i18n.t("premium.labels.perMonth")}
          </Text>
        )}
      </View>

      {/* Features */}
      <View className="mt-4">
        {plan.features.map((feature, idx) => (
          <View
            key={idx}
            className="flex-row items-center mt-2"
          >
            <Ionicons
              name={
                isActive
                  ? "checkmark-circle"
                  : "checkmark-circle-outline"
              }
              size={20}
              color={
                isPremiumPlan
                  ? "#8B5CF6"
                  : "#9CA3AF"
              }
            />

            <Text
              className={`ml-2 ${
                isPremiumPlan
                  ? "text-gray-700"
                  : "text-gray-500"
              }`}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={handleSelectPlan}
        disabled={loading || isActive}
        className={`py-4 rounded-xl items-center justify-center shadow-md ${
          isPremiumPlan
            ? "bg-purple-600 shadow-purple-200"
            : "bg-gray-100"
        } ${
          loading && selectedPlan === plan.id
            ? "opacity-70"
            : ""
        } ${
          isActive
            ? "bg-green-100"
            : ""
        }`}
      >
        <Text
          className={`font-bold text-base ${
            isActive
              ? "text-green-700"
              : isPremiumPlan
              ? "text-white"
              : "text-gray-700"
          }`}
        >
          {getButtonText()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
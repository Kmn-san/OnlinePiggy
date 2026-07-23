// components/GradientHeader.tsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface GradientHeaderProps {
    // Enforces a tuple with at least two strings to satisfy expo-linear-gradient's requirements
    colors: [string, string, ...string[]];
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    showBranding?: boolean;
    showNotification?: boolean;
    onNotificationPress?: () => void;
    showAddButton?: boolean;
    onAddPress?: () => void;
    cardLabel?: string;
    cardValue?: string;
    badgeText?: string;
    badgeVariant?: "emerald" | "red";
}

export default function GradientHeader({
    colors,
    title,
    showBackButton = false,
    onBackPress,
    showBranding = false,
    showNotification = false,
    onNotificationPress,
    showAddButton = false,
    onAddPress,
    cardLabel,
    cardValue,
    badgeText,
    badgeVariant = "emerald",
}: GradientHeaderProps) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const badgeBgClass = badgeVariant === "emerald" ? "bg-emerald-400/30" : "bg-red-400/30";
    const badgeTextClass = badgeVariant === "emerald" ? "text-emerald-50" : "text-red-50";

    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-5 pb-6"
            style={{ paddingTop: insets.top + 16 }}
        >
            {/* --- TOP ROW CONTROLS --- */}
            <View className="flex-row items-center justify-between min-h-[48px]">
                {/* Left Side: Back Button OR Brand Info */}
                <View className="flex-row items-center flex-1">
                    {showBackButton && (
                        <TouchableOpacity
                            onPress={onBackPress || router.back}
                            className="mr-3 p-1 -ml-1 active:opacity-70"
                        >
                            <Ionicons name="chevron-back" size={28} color="white" />
                        </TouchableOpacity>
                    )}

                    {showBranding ? (
                        <View className="flex-row items-center">
                            <Image
                                source={require("@/assets/images/icon.png")}
                                className="w-11 h-11 rounded-full border-2 border-white/30"
                                resizeMode="contain"
                            />
                            <Text className="text-white text-xl font-bold tracking-tight ml-3">
                                OnlinePiggy
                            </Text>
                        </View>
                    ) : (
                        title && (
                            <Text className={`text-white text-xl font-bold tracking-tight ${!showBackButton ? 'mx-auto' : ''}`}>
                                {title}
                            </Text>
                        )
                    )}
                </View>

                {/* Right Side Actions */}
                <View className="flex-row items-center space-x-2">
                    {showNotification && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="w-11 h-11 rounded-full bg-white/20 items-center justify-center"
                            onPress={onNotificationPress}
                        >
                            <Ionicons name="notifications-outline" size={22} color="white" />
                        </TouchableOpacity>
                    )}

                    {showAddButton && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="w-11 h-11 rounded-full bg-white/20 items-center justify-center"
                            onPress={onAddPress}
                        >
                            <Ionicons name="add" size={26} color="white" />
                        </TouchableOpacity>
                    )}
                </View>

                {!showNotification && !showAddButton && !showBranding && showBackButton && <View className="w-7" />}
            </View>

            {/* --- FLOATING METRICS DISPLAY CARD --- */}
            {cardLabel && cardValue && (
                <View className="mt-5 bg-white/20 rounded-2xl p-5 backdrop-blur-sm">
                    <Text className="text-white/80 text-sm font-medium mb-1">
                        {cardLabel}
                    </Text>
                    <Text className="text-white text-3xl font-bold tracking-tight">
                        {cardValue}
                    </Text>
                    {badgeText && (
                        <View className="flex-row items-center mt-2">
                            <View className={`${badgeBgClass} px-3 py-1 rounded-full`}>
                                <Text className={`${badgeTextClass} text-xs font-semibold`}>
                                    {badgeText}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            )}
        </LinearGradient>
    );
}
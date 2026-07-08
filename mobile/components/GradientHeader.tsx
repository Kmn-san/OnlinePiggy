// components/GradientHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GradientHeaderProps {
    title: string;
    onBackPress?: () => void;
    showBackButton?: boolean; // 👈 Controls which version renders
}

export default function GradientHeader({
    title,
    onBackPress,
    showBackButton = true // Defaults to showing the back button
}: GradientHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={["#059669", "#047857"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-4 pb-10"
            style={{ paddingTop: insets.top + 16 }}
        >
            <View
                className={`flex-row items-center mx-2 ${showBackButton ? 'justify-between' : 'justify-center'
                    }`}
            >
                {/* VERSION A: With Back Button */}
                {showBackButton && (
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                        onPress={onBackPress}
                    >
                        <Ionicons name="arrow-back" size={22} color="white" />
                    </TouchableOpacity>
                )}

                {/* Centered Screen Title */}
                <Text className="text-white text-xl font-bold tracking-tight">
                    {title}
                </Text>
                {showBackButton && <View className="w-10" />}
            </View>
        </LinearGradient>
    );
}
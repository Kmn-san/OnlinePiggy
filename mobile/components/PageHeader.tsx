import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PageHeaderProps } from "@/types";

export default function PageHeader({
    title,
    subtitle,
    iconName,
    iconColor = "#8B5CF6"
}: PageHeaderProps) {
    const router = useRouter();

    return (
        <View className="bg-white border-b border-gray-100 pt-12 pb-4 px-5">
            <View className="flex-row items-center">
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-3 p-1 -ml-1 rounded-full active:bg-gray-100"
                >
                    <Ionicons name="chevron-back" size={28} color="#1F2937" />
                </TouchableOpacity>

                {/* Optional Feature Icon (like the Premium Diamond) */}
                {iconName && (
                    <View className="mr-2">
                        <Ionicons name={iconName} size={24} color={iconColor} />
                    </View>
                )}

                {/* Title */}
                <Text className="text-2xl font-bold text-gray-900 tracking-tight">
                    {title}
                </Text>
            </View>

            {/* Optional Subtitle */}
            {subtitle && (
                <Text className="text-gray-500 text-sm mt-1 ml-9">
                    {subtitle}
                </Text>
            )}
        </View>
    );
}
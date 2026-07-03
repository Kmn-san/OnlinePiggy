import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import useCurrentUser from "@/hooks/useCurrentUser";
import i18n from "@/lib/i18n";

export default function EditAvatar() {
  const { user } = useCurrentUser();
  

  const handlePickImage = () => {
    // TODO:
    // Open image picker
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={28}
            color="black"
          />
        </TouchableOpacity>

        <Text className="text-2xl font-bold">
          {i18n.t("title.profilePicture")}
        </Text>

        <TouchableOpacity onPress={handlePickImage}>
          <Ionicons
            name="ellipsis-horizontal"
            size={28}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View className="flex-1 justify-center items-center px-8">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePickImage}
          className="relative"
        >
          <Image
            source={{
              uri:
                user?.avatar_url ??
                "https://ui-avatars.com/api/?name=User",
            }}
            className="w-52 h-52 rounded-full bg-gray-200"
          />

        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
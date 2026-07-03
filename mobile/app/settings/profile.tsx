import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import useCurrentUser from "@/hooks/useCurrentUser";
import i18n from "@/lib/i18n";

export default function Profile() {
  const { user } = useCurrentUser();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="black"
          />
        </TouchableOpacity>

        <Text className="text-2xl font-bold">
          {i18n.t("title.profile")}
        </Text>
      </View>

      <View className="flex-1 px-6">
        {/* Avatar */}
        <View className="items-center mt-10">
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/settings/edit-avatar")}>
            <Image
              source={{
                uri:
                  user?.avatar_url ??
                  "https://ui-avatars.com/api/?name=User",
              }}
              className="w-36 h-36 rounded-full bg-gray-200"
            />

            <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-green-500 items-center justify-center border-4 border-white">
              <Ionicons
                name="camera"
                size={20}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* User Information */}
        <View className="mt-10 bg-gray-50 rounded-2xl">

          {/* Username */}
          <TouchableOpacity
            className="flex-row justify-between items-center px-5 py-5 border-b border-gray-200"
            onPress={() => router.push("/settings/edit-username")}
          >
            <View>
              <Text className="text-gray-400 text-sm">
                {i18n.t("detial.username")}
              </Text>

              <Text className="text-lg font-semibold text-gray-900">
                {user?.username ?? "-"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          {/* OPID */}
          <TouchableOpacity
            className="flex-row justify-between items-center px-5 py-5 border-b border-gray-200" onPress={() => router.push("/settings/edit-opid")}
          >
            <View>
              <Text className="text-gray-400 text-sm">
                OnlinePiggy ID
              </Text>

              <Text className="text-lg text-gray-900">
                {user?.opid ?? "-"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          {/* Country */}
          <TouchableOpacity
            className="flex-row justify-between items-center px-5 py-5" onPress={() => router.push("/settings/edit-country")}
          >
            <View>
              <Text className="text-gray-400 text-sm">
                {i18n.t("detial.country")}
              </Text>

              <Text className="text-lg text-gray-900">
                {user?.country ?? "Japan"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}
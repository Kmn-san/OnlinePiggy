import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import i18n from "../../lib/i18n";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function EditUsername() {
  const { user, updateUser } = useCurrentUser();

  const [username, setUsername] = useState(user?.username ?? "");

  const handleSave = async () => {
    const name = username.trim();

    if (!name) return;

    try {
      await updateUser.mutateAsync({
        username: name,
      });

      router.back();
    } catch (error) {
      console.log(error);
    }
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

        <Text className="text-xl font-bold">
          {i18n.t("title.editUsername")}
        </Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={
            username.trim() === "" ||
            username === user?.username ||
            updateUser.isPending
          }
        >
          <Text
            className={`text-base font-semibold ${
              username.trim() === "" ||
              username === user?.username
                ? "text-gray-400"
                : "text-green-600"
            }`}
          >
            {i18n.t("common.confirm")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input */}
      <View className="px-5 pt-8">
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="flex-1 h-14 text-lg"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
          />

          {username.length > 0 && (
            <TouchableOpacity
              onPress={() => setUsername("")}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
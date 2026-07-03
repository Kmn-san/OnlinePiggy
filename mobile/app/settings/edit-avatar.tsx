import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import useCurrentUser from "@/hooks/useCurrentUser";
import i18n from "@/lib/i18n";

export default function EditAvatar() {
  const { user, updateAvatar } = useCurrentUser();


  const handlePickImage = async () => {
    if (updateAvatar.isPending) return;

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow gallery access');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled) return;

      const image = result.assets[0];
      const formData = new FormData();
      formData.append('profilePic', {
        uri: image.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);

      await updateAvatar.mutateAsync(formData);
      Alert.alert(i18n.t("common.success"), i18n.t("success.profilePicUpdated"))
    } catch (error) {
      console.log(error);
      Alert.alert('Failed to upload image');
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
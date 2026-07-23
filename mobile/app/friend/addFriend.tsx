import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import i18n from "../../lib/i18n";
import { useLanguage } from "../../context/languageContext";
import GradientHeader from "@/components/GradientHeader";
import useFriend from "@/hooks/useFriend";

export default function AddFriend() {
  const { language } = useLanguage();
  const { searchUser, sendRequest } = useFriend()
  const router = useRouter();
  i18n.locale = language;

  const [opid, setOpid] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!opid.trim()) {
      Alert.alert("Error", "Please enter an OPID");
      return;
    }

    setLoading(true);
    setSearched(true);
    setError("");
    setSearchResult(null);

    try {
      const data = await searchUser.mutateAsync(opid.trim())
      setSearchResult(data)
    } catch (error) {
      setError("Failed to search for user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!searchResult) return;
    setLoading(true);
    try {
      await sendRequest.mutateAsync(searchResult.id)
      Alert.alert("Success", "Send Successfully",
        [
          {
            text: "OK",
            onPress: () => {
              handleClearSearch();
              router.back(); // Navigates back ONLY after user taps OK
            }
          }
        ])

    } catch (error) {
      setError("Failed to search for user. Please try again.");
      Alert.alert("Error", "Error")

    } finally {
      setLoading(false);
    }

  };

  const handleClearSearch = () => {
    setOpid("");
    setSearchResult(null);
    setSearched(false);
    setError("");
  };

  return (
    <View className="flex-1 bg-white">
      {/* 1. Gradient Header with correct title & back navigation */}
      <GradientHeader
        colors={["#6D28D9", "#4F46E5"]}
        title={"AddFriend"}
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      {/* 2. Main Body Container with padding */}
      <View className="flex-1 p-4">
        {/* Search Input Bar */}
        <View className="mb-6">
          <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-200 px-4">
            <Ionicons name="search-outline" size={22} color="#9CA3AF" />
            <TextInput
              className="flex-1 py-4 px-3 text-gray-800 text-base"
              placeholder="Enter OPID (e.g., OP12345)"
              value={opid}
              onChangeText={(text) => {
                setOpid(text);
                if (searched) {
                  setSearched(false);
                  setSearchResult(null);
                  setError("");
                }
              }}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {opid.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row justify-between items-center mt-2 px-1">
            <Text className="text-xs text-gray-400">Search by OPID only</Text>
            <TouchableOpacity
              className={`bg-purple-600 rounded-full px-6 py-2 ${loading || !opid.trim() ? "opacity-50" : ""
                }`}
              onPress={handleSearch}
              disabled={loading || !opid.trim()}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold">Search</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Results State */}
        {searched && (
          <View className="flex-1">
            {loading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#8B5CF6" />
                <Text className="text-gray-400 mt-4">Searching...</Text>
              </View>
            ) : error ? (
              <View className="flex-1 justify-center items-center">
                <Ionicons name="person-outline" size={64} color="#D1D5DB" />
                <Text className="text-gray-400 text-center mt-4">{error}</Text>
                <TouchableOpacity
                  className="mt-4 bg-purple-600 rounded-full px-6 py-2"
                  onPress={handleClearSearch}
                >
                  <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : searchResult ? (
              <View className="flex-1">
                <View className="bg-purple-50 rounded-2xl p-6 border border-purple-200">

                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: searchResult.avatar_url }}
                      className="w-20 h-20 rounded-full"
                    />
                    <View className="ml-4 flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-xl font-bold text-gray-800">
                          {searchResult.username}
                        </Text>
                        {searchResult.online && (
                          <View className="ml-2 bg-green-500 rounded-full px-2 py-0.5">

                          </View>
                        )}
                      </View>
                      <Text className="text-gray-500 mt-1">
                        OPID: {searchResult.opid}
                      </Text>

                    </View>
                  </View>

                  {searchResult.isFriend ? (
                    <View className="mt-6 bg-green-100 rounded-full py-3 px-4 flex-row justify-center items-center">
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#22C55E"
                      />
                      <Text className="text-green-700 font-semibold ml-2">
                        Already Friends
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="mt-6 bg-purple-600 rounded-full py-3 flex-row justify-center items-center"
                      onPress={handleSendFriendRequest}
                    >
                      <Ionicons name="person-add" size={24} color="white" />
                      <Text className="text-white font-semibold text-lg ml-2">
                        Send Friend Request
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Additional Tip Box */}
                <View className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <Text className="text-gray-600 text-sm">
                    <Ionicons
                      name="information-circle-outline"
                      size={16}
                      color="#6B7280"
                    />
                    {"  "}Make sure this is the correct person before sending a
                    friend request.
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        )}

        {/* Initial Empty State */}
        {!searched && !loading && (
          <View className="flex-1 justify-center items-center">
            <Ionicons
              name="search-circle-outline"
              size={100}
              color="#E5E7EB"
            />
            <Text className="text-gray-400 text-lg mt-4">
              Search for users by OPID
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Enter an OPID and click Search
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
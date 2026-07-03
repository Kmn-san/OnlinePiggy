import { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import i18n from "../../lib/i18n";
import countries from "../../lib/countries"; // Using your perfectly configured lib
import useCurrentUser from "../../hooks/useCurrentUser";
import { useLanguage } from "../../context/languageContext";

export default function EditCountry() {
  const { user, updateUser } = useCurrentUser();
  const { language } = useLanguage();

  i18n.locale = language;

  const [search, setSearch] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const locale = ["ja", "zh"].includes(language) ? language : "en";

  // 1. Generate the translated list for the UI
  const countryList = useMemo(() => {
    return Object.entries(countries.getNames(locale)).map(
      ([code, name]) => ({
        code,
        name,
      })
    );
  }, [locale]);

  // FIX: 2. Wait for async user data to load, THEN find the matching code
  useEffect(() => {
    if (user?.country) {
      const englishCountries = countries.getNames("en");
      const entry = Object.entries(englishCountries).find(
        ([, englishName]) => 
          englishName.toLowerCase() === user.country.toLowerCase()
      );

      if (entry) {
        setCountryCode(entry[0]); // entry[0] is the ISO code (e.g., 'US', 'JP')
      }
    }
  }, [user?.country]);

  const filteredCountries = useMemo(() => {
    return countryList.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [countryList, search]);

  const handleSave = async () => {
    if (!countryCode) return;

    // 3. Convert the selected code explicitly back to English for the DB
    const englishCountryName = countries.getName(countryCode, "en");

    if (!englishCountryName) return;

    try {
      await updateUser.mutateAsync({
        country: englishCountryName,
      });

      router.back();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold">
          {i18n.t("title.editCountry")}
        </Text>

        <TouchableOpacity onPress={handleSave} disabled={updateUser.isPending}>
          <Text
            className={`font-semibold text-lg ${
              updateUser.isPending ? "text-gray-400" : "text-green-600"
            }`}
          >
            {i18n.t("common.confirm")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="px-5 py-4">
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={i18n.t("common.searchCountry")}
            className="flex-1 h-12 ml-3 text-base"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Country List */}
      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.code}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={20}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setCountryCode(item.code)}
            className={`flex-row items-center justify-between p-4 rounded-xl mb-3 border ${
              item.code === countryCode
                ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <Text className="text-lg text-gray-800">{item.name}</Text>

            {item.code === countryCode && (
              <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
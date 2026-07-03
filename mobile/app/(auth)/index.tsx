import { View, Text, Image, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useState } from "react"; 
import useSocialAuth from "../../hooks/useSocialAuth";
import i18n from "../../lib/i18n";
import { useLanguage } from "../../context/languageContext";

const languages = [
  { code: "en" },
  { code: "ja" },
  { code: "zh" },
] as const;

export default function AuthScreen() {
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();
  const { language, setLanguage } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  

  i18n.locale = language; 

  const t = (key: string) => i18n.t(key);

  return (
    <View className="flex-1 justify-center items-center bg-white px-8">
      {/* Logo */}
      <Image
        source={require("@/assets/images/icon.png")}
        className="w-72 h-72"
        resizeMode="contain"
      />

      {/* Google */}
      <TouchableOpacity
        className="w-full flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 mt-4"
        onPress={() => handleSocialAuth("oauth_google")}
        disabled={loadingStrategy !== null}
      >
        {loadingStrategy === "oauth_google" ? (
          <ActivityIndicator color="#4285F4" />
        ) : (
          <>
            <Image
              source={require("@/assets/images/google.png")}
              className="w-8 h-8 mr-3"
            />
            <Text className="text-base font-medium">
              {t("auth.google")}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Apple */}
      <TouchableOpacity
        className="w-full flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 mt-3"
        onPress={() => handleSocialAuth("oauth_apple")}
        disabled={loadingStrategy !== null}
      >
        {loadingStrategy === "oauth_apple" ? (
          <ActivityIndicator />
        ) : (
          <>
            <Image
              source={require("@/assets/images/apple.png")}
              className="w-7 h-7 mr-3"
            />
            <Text className="text-base font-medium">
              {t("auth.apple")}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Language Button */}
      <TouchableOpacity
        className="mt-6 px-4 py-2 bg-gray-100 rounded-full"
        onPress={() => setModalVisible(true)}
      >
        <Text>
          {t(`languages.${language}.short`)}
        </Text>
      </TouchableOpacity>

      {/* Language Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/40 justify-center items-center"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-2xl w-72 p-5">
            <Text className="text-xl font-bold text-center mb-5">
              {t("menu.selectLanguage")}
            </Text>

            {languages.map((item) => (
              <TouchableOpacity
                key={item.code}
                className={`flex-row justify-between items-center p-4 rounded-xl mb-2 ${
                  language === item.code
                    ? "bg-green-50 border border-green-500"
                    : "bg-gray-50"
                }`}
                onPress={async () => {
                  await setLanguage(item.code);
                  setModalVisible(false);
                }}
              >
                <View>
                  <Text className="text-lg font-semibold">
                    {t(`languages.${item.code}.native`)}
                  </Text>

                  {language !== item.code && (
                    <Text className="text-gray-500">
                      {t(`languages.${item.code}.translated`)}
                    </Text>
                  )}
                </View>

                {language === item.code && (
                  <Text className="text-green-500 text-lg">✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              className="mt-3"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center text-gray-500">
                {t("auth.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Terms */}
      <Text className="text-xs text-center text-gray-500 mt-8 px-2">
        {t("auth.agreement")}{" "}
        <Text className="text-blue-500">
          {t("auth.terms")}
        </Text>
        {", "}
        <Text className="text-blue-500">
          {t("auth.privacy")}
        </Text>
        {", "}
        <Text className="text-blue-500">
          {t("auth.cookie")}
        </Text>
      </Text>
    </View>
  );
}
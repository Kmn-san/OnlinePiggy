// app/(tabs)/index.tsx
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import i18n from "../../lib/i18n";
import { useLanguage } from "../../context/languageContext";

export default function Expenses() {
  const navigation = useNavigation();
  const { language } = useLanguage();

  useLayoutEffect(() => {
    navigation.setOptions({ title: i18n.t("tabs.expenses") });
  }, [language]);

}
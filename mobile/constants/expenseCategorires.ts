import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

export interface CategoryConfig {
  id: string;
  label: string;
  icon: IoniconsName;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { id: "daily", label: "DAILY_EXPENSES", icon: "restaurant-outline", color: "#FF6B6B" },
  { id: "entertainment", label: "entertainment", icon: "film-outline", color: "#4ECDC4" },
  { id: "housing", label: "housing", icon: "home-outline", color: "#FFA07A" },
  { id: "utilities", label: "utilities", icon: "bulb-outline", color: "#FFD93D" },
  { id: "transportation", label: "transportation", icon: "car-outline", color: "#6C5CE7" },
  { id: "healthcare", label: "healthcare", icon: "medical-outline", color: "#FF6B6B" },
  { id: "education", label: "education", icon: "book-outline", color: "#74B9FF" },
  { id: "insurance", label: "insurance", icon: "shield-checkmark-outline", color: "#A8E6CF" },
  { id: "debt", label: "debt", icon: "card-outline", color: "#FF8A5C" },
  { id: "subscriptions", label: "subscriptions", icon: "phone-portrait-outline", color: "#A29BFE" },
];

export const getCategoryForAccount = (accountName: string): string => {
  const lowerName = accountName.toLowerCase();
  if (lowerName.includes("daily") || lowerName.includes("food")) return "daily";
  if (lowerName.includes("entertain") || lowerName.includes("fun")) return "entertainment";
  if (lowerName.includes("house") || lowerName.includes("rent") || lowerName.includes("mortgage")) return "housing";
  if (lowerName.includes("utility") || lowerName.includes("electric") || lowerName.includes("water") || lowerName.includes("gas")) return "utilities";
  if (lowerName.includes("transport") || lowerName.includes("car") || lowerName.includes("fuel") || lowerName.includes("gasoline")) return "transportation";
  if (lowerName.includes("health") || lowerName.includes("medical") || lowerName.includes("doctor")) return "healthcare";
  if (lowerName.includes("educat") || lowerName.includes("school") || lowerName.includes("tuition")) return "education";
  if (lowerName.includes("insurance") || lowerName.includes("insur")) return "insurance";
  if (lowerName.includes("debt") || lowerName.includes("loan") || lowerName.includes("credit")) return "debt";
  if (lowerName.includes("subscription") || lowerName.includes("netflix") || lowerName.includes("spotify")) return "subscriptions";
  return "daily";
};
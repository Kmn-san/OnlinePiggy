// utils/expenseHelpers.ts
import i18n from "../lib/i18n";

export const getCategoryIconAndColor = (accountName: string) => {
  const name = accountName.toUpperCase();
  
  if (name.includes('DAILY') || name.includes('FOOD')) {
    return { icon: 'restaurant-outline' as const, color: '#FF6B6B', bg: 'bg-red-50' };
  }
  if (name.includes('ENTERTAIN')) {
    return { icon: 'film-outline' as const, color: '#4ECDC4', bg: 'bg-cyan-50' };
  }
  if (name.includes('HOUSE') || name.includes('RENT') || name.includes('MORTGAGE')) {
    return { icon: 'home-outline' as const, color: '#FFA07A', bg: 'bg-orange-50' };
  }
  if (name.includes('UTILITY') || name.includes('ELECTRIC') || name.includes('WATER')) {
    return { icon: 'flash-outline' as const, color: '#FFD93D', bg: 'bg-yellow-50' };
  }
  if (name.includes('TRANSPORT') || name.includes('CAR') || name.includes('FUEL')) {
    return { icon: 'car-outline' as const, color: '#6C5CE7', bg: 'bg-indigo-50' };
  }
  if (name.includes('HEALTH') || name.includes('MEDICAL')) {
    return { icon: 'heart-half-outline' as const, color: '#FF6B6B', bg: 'bg-rose-50' };
  }
  if (name.includes('EDUCAT') || name.includes('SCHOOL')) {
    return { icon: 'book-outline' as const, color: '#74B9FF', bg: 'bg-blue-50' };
  }
  if (name.includes('SUBSCRIPTION') || name.includes('NETFLIX')) {
    return { icon: 'phone-portrait-outline' as const, color: '#A29BFE', bg: 'bg-purple-50' };
  }
  
  return { icon: 'cash-outline' as const, color: '#DC2626', bg: 'bg-red-50' };
};

export const formatLocalizedDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(i18n.locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
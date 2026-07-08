import i18n from "@/lib/i18n";

export const formatCurrency = (amount: number, currency: string): string => {
  // Gracefully fallback to 0 if amount is null, undefined, or NaN
  const safeAmount = typeof amount !== 'number' || isNaN(amount) ? 0 : amount;

  // Map currency codes to their ideal matching locale formatting rules
  let operationalLocale = 'en-US';
  if (currency === 'MYR') operationalLocale = 'en-MY';
  if (currency === 'CNY') operationalLocale = 'zh-CN';
  if (currency === 'JPY') operationalLocale = 'ja-JP';

  return new Intl.NumberFormat(operationalLocale, {
    style: 'currency',
    currency: currency,
    // 💡 Removed minimumFractionDigits: 2 so JPY renders as ¥1,500 
    // and USD renders cleanly as $1,500.00 automatically.
  }).format(safeAmount);
};

export const getLocalizedType = (type: string): string => {
  switch (type) {
    case "WORKING_CAPITAL":
      return i18n.t("savings.WORKING_CAPITAL");
    case "EMERGENCY_CAPITAL":
      return i18n.t("savings.EMERGENCY_CAPITAL");
    case "SAVINGS":
      return i18n.t("savings.SAVINGS");
    case "GOAL":
      return i18n.t("savings.GOAL_ACCOUNT");
    case "EXPENSES":
      return i18n.t("expenses.EXPENSES");
    default:
      return type;
  }
};
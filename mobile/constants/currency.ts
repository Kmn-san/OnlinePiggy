import i18n from "@/lib/i18n";

export const formatCurrency = (
  amount: number | string,
  currency: string
): string => {
  const safeAmount = Number(amount);

  const finalAmount = isNaN(safeAmount) ? 0 : safeAmount;

  let operationalLocale = "en-US";
  if (currency === "MYR") operationalLocale = "en-MY";
  if (currency === "CNY") operationalLocale = "zh-CN";
  if (currency === "JPY") operationalLocale = "ja-JP";

  return new Intl.NumberFormat(operationalLocale, {
    style: "currency",
    currency,
  }).format(finalAmount);
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
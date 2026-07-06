export const formatCurrency = (amount: number, currency: string): string => {
  const safeAmount = isNaN(amount) || !amount ? 0 : amount;

  // Map currency codes to their ideal matching locale formatting rules
  let operationalLocale = 'en-US';
  if (currency === 'MYR') operationalLocale = 'en-MY';
  if (currency === 'CNY') operationalLocale = 'zh-CN';
  if (currency === 'JPY') operationalLocale = 'ja-JP';

  return new Intl.NumberFormat(operationalLocale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(safeAmount);
};
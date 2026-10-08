export const formatCurrency = (amount, currency = 'EGP', locale = 'en-US') => {
  const numericAmount = Number(amount) || 0;
  const isArabic = Boolean(
    (typeof locale === 'string' && locale.toLowerCase().startsWith('ar')) ||
    locale === true
  );
  const effectiveLocale = isArabic ? 'ar-EG' : (typeof locale === 'string' ? locale : 'en-US');

  const formattedNumber = new Intl.NumberFormat(effectiveLocale, {
    maximumFractionDigits: 0,
  }).format(numericAmount);

  const symbol = isArabic ? (currency === 'EGP' ? 'ج.م' : currency) : currency;

  return `${formattedNumber} ${symbol}`;
};

export const formatDate = (dateString, locale = 'en-US') => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString, locale = 'en-US') => {
  if (!timeString) return '-';
  try {
    const date = new Date(timeString);
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return timeString;
  }
};

/**
 * Converts Western digits (0-9) to Eastern Arabic digits (٠-٩)
 */
export const toArabicDigits = (val) => {
  if (!val && val !== 0) return '';
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(val).replace(/[0-9]/g, (d) => arabicDigits[+d]);
};

/**
 * Formats a number or string value based on RTL/LTR locale
 */
export const formatNumberByLocale = (val, isRTL = false) => {
  if (!val && val !== 0) return '';
  return isRTL ? toArabicDigits(val) : String(val);
};

/**
 * Formats a time range (e.g. '06:00 PM - 09:00 PM') into localized start and end parts
 */
export const formatTimeRange = (rawHours, isRTL = false, markers = {}) => {
  if (!rawHours) return { start: '-', end: '-', formatted: '-' };
  const parts = String(rawHours).split(/[-–]/).map((s) => s.trim());
  if (parts.length < 2) return { start: rawHours, end: '', formatted: rawHours };

  const amMarker = markers.am || (isRTL ? 'ص' : 'AM');
  const pmMarker = markers.pm || (isRTL ? 'م' : 'PM');

  const formatSingleTime = (timeStr) => {
    const isPM = /PM/i.test(timeStr);
    const isAM = /AM/i.test(timeStr);
    const timeDigits = timeStr.replace(/[a-zA-Z]/g, '').trim();
    const marker = isPM ? pmMarker : isAM ? amMarker : '';

    if (!isRTL) {
      return `${timeDigits} ${marker}`.trim();
    }

    const arDigits = toArabicDigits(timeDigits);
    return `${arDigits} ${marker}`.trim();
  };

  const start = formatSingleTime(parts[0]);
  const end = formatSingleTime(parts[1]);

  return {
    start,
    end,
    formatted: `${start} - ${end}`
  };
};

/**
 * Parses metric percentage or count changes (e.g. '+12.5%', '-4.2%') with locale-aware numerals
 */
export const parseMetricChange = (change, isRTL = false) => {
  if (!change && change !== 0) return null;
  const str = String(change).trim();
  const isNegative = str.startsWith('-');
  const isPositiveSign = str.startsWith('+');
  const numericPart = str.replace(/^[+-]/, '');
  const localizedNumeric = isRTL ? toArabicDigits(numericPart) : numericPart;
  const sign = isNegative ? '-' : isPositiveSign ? '+' : '';
  return { isNegative, sign, numericPart: localizedNumeric };
};

/**
 * Formats large numbers compactly (e.g. 5000 -> '5K', 150000 -> '150K', 1200000 -> '1.2M')
 */
export const formatCompactNumber = (val) => {
  const num = Number(val);
  if (isNaN(num)) return val;
  if (Math.abs(num) >= 1_000_000) {
    const formatted = (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1);
    return `${formatted}M`;
  }
  if (Math.abs(num) >= 1_000) {
    const formatted = (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1);
    return `${formatted}K`;
  }
  return String(num);
};

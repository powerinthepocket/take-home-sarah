export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): string {
  if (oldValue === 0) {
    return "N/A";
  }

  const change = ((newValue - oldValue) / oldValue) * 100;
  return change.toFixed(2) + "%";
}

export function getAssetsWithNonZeroVolume(
  data: Array<{
    asset_id: string;
    name: string;
    volume_1day_usd: number;
    price_usd: number;
  }>
) {
  if (!data) {
    return;
  }
  return data
    .filter((item) => item.volume_1day_usd !== 0)
    .map((item) => ({
      asset_id: item.asset_id,
      name: item.name,
      price_usd: item.price_usd,
    }));
}

export const formatNumber = (
  num: number | string,
  decimalPlaces: number = 4
): string => {
  const parsedNum = typeof num === "string" ? parseFloat(num) : num;

  if (parsedNum >= 1_000_000_000_000) {
    return (parsedNum / 1_000_000_000_000)?.toFixed(decimalPlaces) + "T";
  } else if (parsedNum >= 1_000_000_000) {
    return (parsedNum / 1_000_000_000)?.toFixed(decimalPlaces) + "B";
  } else if (parsedNum >= 1_000_000) {
    return (parsedNum / 1_000_000)?.toFixed(decimalPlaces) + "M";
  } else if (parsedNum >= 1_000) {
    return (parsedNum / 1_000)?.toFixed(decimalPlaces) + "k";
  } else {
    return parsedNum?.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
  }
};

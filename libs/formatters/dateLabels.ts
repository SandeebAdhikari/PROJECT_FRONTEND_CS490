const toDate = (value: string | number | Date | null | undefined) => {
  if (value instanceof Date) return value;
  if (value === null || value === undefined) return null;
  const asNumber =
    typeof value === "number" ? new Date(value) : new Date(String(value));
  return Number.isNaN(asNumber.getTime()) ? null : asNumber;
};

const baseFormatter = (
  value: string | number | Date | null | undefined,
  options: Intl.DateTimeFormatOptions
) => {
  const parsed = toDate(value);
  if (!parsed) return typeof value === "string" ? value : "";
  return parsed.toLocaleDateString(undefined, options);
};

export const toShortDateLabel = (
  value: string | number | Date | null | undefined
) => baseFormatter(value, { month: "short", day: "numeric" });

export const toFullDateLabel = (
  value: string | number | Date | null | undefined
) =>
  baseFormatter(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
